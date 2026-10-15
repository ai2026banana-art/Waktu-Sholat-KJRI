package com.masjid.jadwalsholat.data

/**
 * Model data jadwal sholat untuk aplikasi Masjid As Syafir.
 * Didesain sederhana agar mudah dimodifikasi oleh pengurus atau pengembang.
 */

enum class PrayerType(val displayName: String, val arabicName: String) {
    IMSAK("Imsak", "الإمساك"),
    SUBUH("Subuh", "الفجر"),
    SYURUK("Syuruk", "الشروق"),
    ZOHOR("Zohor", "الظهر"),
    ASAR("Asar", "العصر"),
    MAGHRIB("Maghrib", "المغرب"),
    ISYAK("Isyak", "العشاء")
}

data class PrayerItem(
    val type: PrayerType,
    val time: String, // Format HH:mm (contoh: "05:10")
    val adjustedTime: String, // Format HH:mm setelah ditambah/dikurang koreksi menit
    val offsetMinutes: Int = 0,
    val isNext: Boolean = false,
    val isCurrent: Boolean = false
)

data class MosqueSettings(
    val mosqueName: String = "As Syafir",
    val subtitle: String = "KJRI Kuching, Sarawak, Malaysia",
    val timezoneId: String = "Asia/Kuching",
    // Zona resmi JAKIM untuk Kuching, Bau, Lundu, Sematan adalah "SWK08"
    val jakimZone: String = "SWK08",
    val isSampleData: Boolean = true, // Bernilai TRUE selama belum diverifikasi resmi
    val announcement: String = "Selamat Datang di Masjid As Syafir KJRI Kuching · Harap luruskan shaf · Nonaktifkan dering ponsel.",
    val enableIqamah: Boolean = true,
    val isDarkTheme: Boolean = true,
    // Koreksi manual menit untuk tiap waktu (+/- menit)
    val minuteCorrections: Map<PrayerType, Int> = mapOf(
        PrayerType.SUBUH to 0,
        PrayerType.SYURUK to 0,
        PrayerType.ZOHOR to 0,
        PrayerType.ASAR to 0,
        PrayerType.MAGHRIB to 0,
        PrayerType.ISYAK to 0
    ),
    // Durasi hitung mundur iqamah (dalam menit)
    val iqamahMinutes: Map<PrayerType, Int> = mapOf(
        PrayerType.SUBUH to 12,
        PrayerType.ZOHOR to 10,
        PrayerType.ASAR to 10,
        PrayerType.MAGHRIB to 8,
        PrayerType.ISYAK to 10
    ),
    // Jadwal manual jika pengurus memilih input mandiri
    val manualTimes: Map<PrayerType, String> = mapOf(
        PrayerType.IMSAK to "05:00",
        PrayerType.SUBUH to "05:10",
        PrayerType.SYURUK to "06:22",
        PrayerType.ZOHOR to "12:31",
        PrayerType.ASAR to "15:42",
        PrayerType.MAGHRIB to "18:34",
        PrayerType.ISYAK to "19:43"
    )
)
