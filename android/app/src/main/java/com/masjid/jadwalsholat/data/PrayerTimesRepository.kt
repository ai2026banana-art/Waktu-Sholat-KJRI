package com.masjid.jadwalsholat.data

import android.content.Context
import android.content.SharedPreferences
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

/**
 * Repository terpisah untuk mengelola sumber data jadwal sholat.
 * Berfungsi baik saat online maupun offline dengan SharedPreferences lokal.
 *
 * PERHATIAN UNTUK PENGURUS/PENGEMBANG:
 * - Lokasi API resmi JAKIM atau e-Solat disiapkan di sini.
 * - Tidak ada kunci rahasia / API key yang disimpan di sini.
 */
class PrayerTimesRepository(context: Context) {

    private val prefs: SharedPreferences =
        context.getSharedPreferences("masjid_prayer_prefs", Context.MODE_PRIVATE)

    // Data contoh awal untuk Kuching SWK08 - selalu dilabeli data contoh
    private val defaultSampleSchedule = mapOf(
        PrayerType.IMSAK to "05:00",
        PrayerType.SUBUH to "05:10",
        PrayerType.SYURUK to "06:22",
        PrayerType.ZOHOR to "12:31",
        PrayerType.ASAR to "15:42",
        PrayerType.MAGHRIB to "18:34",
        PrayerType.ISYAK to "19:43"
    )

    /**
     * Memuat pengaturan masjid yang disimpan pengurus secara lokal.
     */
    fun loadSettings(): MosqueSettings {
        val name = prefs.getString("mosque_name", "As Syafir") ?: "As Syafir"
        val subtitle = prefs.getString("subtitle", "KJRI Kuching, Sarawak, Malaysia") ?: "KJRI Kuching, Sarawak, Malaysia"
        val zone = prefs.getString("jakim_zone", "SWK08") ?: "SWK08"
        val isSample = prefs.getBoolean("is_sample_data", true)
        val announcement = prefs.getString(
            "announcement",
            "Selamat Datang di Masjid As Syafir KJRI Kuching · Harap luruskan shaf · Nonaktifkan dering ponsel."
        ) ?: ""
        val isDark = prefs.getBoolean("is_dark_theme", true)
        val enableIqamah = prefs.getBoolean("enable_iqamah", true)

        return MosqueSettings(
            mosqueName = name,
            subtitle = subtitle,
            jakimZone = zone,
            isSampleData = isSample,
            announcement = announcement,
            isDarkTheme = isDark,
            enableIqamah = enableIqamah,
            manualTimes = loadSavedSchedule()
        )
    }

    /**
     * Menyimpan pengaturan masjid ke penyimpanan lokal Android (SharedPreferences).
     */
    fun saveSettings(settings: MosqueSettings) {
        prefs.edit().apply {
            putString("mosque_name", settings.mosqueName)
            putString("subtitle", settings.subtitle)
            putString("jakim_zone", settings.jakimZone)
            putBoolean("is_sample_data", settings.isSampleData)
            putString("announcement", settings.announcement)
            putBoolean("is_dark_theme", settings.isDarkTheme)
            putBoolean("enable_iqamah", settings.enableIqamah)
            apply()
        }
        saveScheduleLocally(settings.manualTimes)
    }

    /**
     * Menyimpan waktu jadwal sholat lokal.
     */
    fun saveScheduleLocally(schedule: Map<PrayerType, String>) {
        val editor = prefs.edit()
        for ((type, time) in schedule) {
            editor.putString("prayer_time_${type.name}", time)
        }
        editor.apply()
    }

    /**
     * Mengambil jadwal terakhir yang tersimpan secara lokal (offline fallback).
     */
    fun loadSavedSchedule(): Map<PrayerType, String> {
        val result = mutableMapOf<PrayerType, String>()
        for (type in PrayerType.values()) {
            val saved = prefs.getString("prayer_time_${type.name}", null)
            result[type] = saved ?: (defaultSampleSchedule[type] ?: "00:00")
        }
        return result
    }

    /**
     * Memuat jadwal dari API e-Solat JAKIM.
     * Jika gagal (misal koneksi terputus), otomatis menggunakan jadwal lokal tanpa membuat aplikasi crash.
     */
    suspend fun fetchOfficialJakimSchedule(zone: String): Result<Map<PrayerType, String>> =
        withContext(Dispatchers.IO) {
            try {
                // Endpoint terbuka untuk jadwal resmi e-Solat JAKIM Malaysia
                val urlString = "https://api.waktusolat.app/v2/solat/$zone"
                val url = URL(urlString)
                val conn = url.openConnection() as HttpURLConnection
                conn.connectTimeout = 6000
                conn.readTimeout = 6000
                conn.requestMethod = "GET"

                if (conn.responseCode == 200) {
                    val stream = conn.inputStream.bufferedReader().use { it.readText() }
                    val json = JSONObject(stream)
                    val prayersArray = json.optJSONArray("prayers")

                    if (prayersArray != null && prayersArray.length() > 0) {
                        val today = prayersArray.getJSONObject(0)
                        val fetchedTimes = mutableMapOf<PrayerType, String>()

                        // Format epoch ke jam HH:mm
                        fun formatEpoch(epochSec: Long): String {
                            val cal = java.util.Calendar.getInstance()
                            cal.timeInMillis = epochSec * 1000
                            val h = String.format("%02d", cal.get(java.util.Calendar.HOUR_OF_DAY))
                            val m = String.format("%02d", cal.get(java.util.Calendar.MINUTE))
                            return "$h:$m"
                        }

                        if (today.has("imsak")) fetchedTimes[PrayerType.IMSAK] = formatEpoch(today.getLong("imsak"))
                        fetchedTimes[PrayerType.SUBUH] = formatEpoch(today.getLong("fajr"))
                        fetchedTimes[PrayerType.SYURUK] = formatEpoch(today.getLong("syuruk"))
                        fetchedTimes[PrayerType.ZOHOR] = formatEpoch(today.getLong("dhuhr"))
                        fetchedTimes[PrayerType.ASAR] = formatEpoch(today.getLong("asr"))
                        fetchedTimes[PrayerType.MAGHRIB] = formatEpoch(today.getLong("maghrib"))
                        fetchedTimes[PrayerType.ISYAK] = formatEpoch(today.getLong("isha"))

                        // Simpan ke cache lokal untuk penggunaan offline berikutnya
                        saveScheduleLocally(fetchedTimes)
                        Result.success(fetchedTimes)
                    } else {
                        Result.failure(Exception("Data kosong dari server"))
                    }
                } else {
                    Result.failure(Exception("HTTP Error: ${conn.responseCode}"))
                }
            } catch (e: Exception) {
                // Jangan panik jika internet terputus, gunakan cache lokal
                Result.failure(e)
            }
        }
}
