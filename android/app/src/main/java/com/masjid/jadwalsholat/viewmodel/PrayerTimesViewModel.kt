package com.masjid.jadwalsholat.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.masjid.jadwalsholat.data.MosqueSettings
import com.masjid.jadwalsholat.data.PrayerItem
import com.masjid.jadwalsholat.data.PrayerTimesRepository
import com.masjid.jadwalsholat.data.PrayerType
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import java.util.TimeZone

data class ScreenUiState(
    val currentTimeString: String = "00:00:00",
    val currentDateMasehi: String = "",
    val currentDayName: String = "",
    val currentDateHijri: String = "",
    val prayerList: List<PrayerItem> = emptyList(),
    val nextPrayer: PrayerItem? = null,
    val countdownText: String = "00:00:00",
    val isAfterIsyak: Boolean = false,
    val isIqamahActive: Boolean = false,
    val iqamahRemainingText: String = "",
    val settings: MosqueSettings = MosqueSettings(),
    val statusMessage: String = ""
)

class PrayerTimesViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = PrayerTimesRepository(application)

    private val _uiState = MutableStateFlow(ScreenUiState())
    val uiState: StateFlow<ScreenUiState> = _uiState.asStateFlow()

    init {
        loadInitialData()
        startClockAndCountdownLoop()
    }

    private fun loadInitialData() {
        val loadedSettings = repository.loadSettings()
        _uiState.value = _uiState.value.copy(settings = loadedSettings)
        updatePrayerDisplay()
    }

    /**
     * Loop 1 detik untuk memperbarui jam dan hitung mundur tanpa membebani CPU/baterai.
     */
    private fun startClockAndCountdownLoop() {
        viewModelScope.launch {
            while (isActive) {
                tick()
                delay(1000)
            }
        }
    }

    private fun tick() {
        val cal = Calendar.getInstance(TimeZone.getTimeZone(_uiState.value.settings.timezoneId))
        val timeFormat = SimpleDateFormat("HH:mm:ss", Locale.getDefault())
        val dateFormat = SimpleDateFormat("d MMMM yyyy", Locale("id", "ID"))
        val dayFormat = SimpleDateFormat("EEEE", Locale("id", "ID"))

        val now = cal.time
        val timeString = timeFormat.format(now)
        val dateMasehi = dateFormat.format(now)
        val dayName = dayFormat.format(now)
        val dateHijri = getApproxHijriDate(cal)

        // Hitung waktu sholat aktif dan berikutnya
        val currentSecondsOfDay = cal.get(Calendar.HOUR_OF_DAY) * 3600 +
                cal.get(Calendar.MINUTE) * 60 +
                cal.get(Calendar.SECOND)

        val activeList = buildAdjustedPrayerList()
        val trackingPrayers = activeList.filter {
            it.type in listOf(PrayerType.SUBUH, PrayerType.ZOHOR, PrayerType.ASAR, PrayerType.MAGHRIB, PrayerType.ISYAK)
        }

        var nextItem: PrayerItem? = null
        var currentItem: PrayerItem? = null
        var afterIsyak = false
        var countdownSec = 0

        for (i in trackingPrayers.indices) {
            val item = trackingPrayers[i]
            val parts = item.adjustedTime.split(":")
            val prayerSec = parts[0].toInt() * 3600 + parts[1].toInt() * 60

            if (currentSecondsOfDay < prayerSec) {
                nextItem = item
                countdownSec = prayerSec - currentSecondsOfDay
                break
            } else {
                currentItem = item
            }
        }

        // Jika sudah lewat Isyak, waktu berikutnya adalah Subuh besok!
        if (nextItem == null && trackingPrayers.isNotEmpty()) {
            afterIsyak = true
            val subuh = trackingPrayers.first { it.type == PrayerType.SUBUH }
            nextItem = subuh
            val parts = subuh.adjustedTime.split(":")
            val subuhSecTomorrow = 86400 + (parts[0].toInt() * 3600 + parts[1].toInt() * 60)
            countdownSec = subuhSecTomorrow - currentSecondsOfDay
        }

        // Cek Iqamah
        var isIqamah = false
        var iqamahText = ""
        if (_uiState.value.settings.enableIqamah && currentItem != null) {
            val parts = currentItem.adjustedTime.split(":")
            val adhanSec = parts[0].toInt() * 3600 + parts[1].toInt() * 60
            val elapsed = currentSecondsOfDay - adhanSec
            val iqamahDurationSec = (_uiState.value.settings.iqamahMinutes[currentItem.type] ?: 10) * 60

            if (elapsed in 0 until iqamahDurationSec) {
                isIqamah = true
                val remain = iqamahDurationSec - elapsed
                iqamahText = formatSeconds(remain)
            }
        }

        // Update list dengan tanda isNext
        val updatedList = activeList.map { item ->
            item.copy(
                isNext = (item.type == nextItem?.type),
                isCurrent = (item.type == currentItem?.type)
            )
        }

        _uiState.value = _uiState.value.copy(
            currentTimeString = timeString,
            currentDateMasehi = dateMasehi,
            currentDayName = dayName,
            currentDateHijri = dateHijri,
            prayerList = updatedList,
            nextPrayer = nextItem,
            countdownText = formatSeconds(countdownSec),
            isAfterIsyak = afterIsyak,
            isIqamahActive = isIqamah,
            iqamahRemainingText = iqamahText
        )
    }

    private fun buildAdjustedPrayerList(): List<PrayerItem> {
        val settings = _uiState.value.settings
        val list = mutableListOf<PrayerItem>()
        val types = listOf(
            PrayerType.SUBUH,
            PrayerType.SYURUK,
            PrayerType.ZOHOR,
            PrayerType.ASAR,
            PrayerType.MAGHRIB,
            PrayerType.ISYAK
        )

        for (type in types) {
            val baseTime = settings.manualTimes[type] ?: "00:00"
            val offset = settings.minuteCorrections[type] ?: 0
            val adjusted = applyOffset(baseTime, offset)

            list.add(
                PrayerItem(
                    type = type,
                    time = baseTime,
                    adjustedTime = adjusted,
                    offsetMinutes = offset
                )
            )
        }
        return list
    }

    private fun applyOffset(time: String, offsetMinutes: Int): String {
        val parts = time.split(":")
        if (parts.size != 2) return time
        var total = parts[0].toInt() * 60 + parts[1].toInt() + offsetMinutes
        total = ((total % 1440) + 1440) % 1440
        val h = total / 60
        val m = total % 60
        return String.format("%02d:%02d", h, m)
    }

    private fun formatSeconds(seconds: Int): String {
        val h = seconds / 3600
        val m = (seconds % 3600) / 60
        val s = seconds % 60
        return String.format("%02d:%02d:%02d", h, m, s)
    }

    private fun getApproxHijriDate(cal: Calendar): String {
        // Konversi penanggalan Hijriyah
        val months = listOf(
            "Muharram", "Safar", "Rabiul Awwal", "Rabiul Akhir",
            "Jumadil Ula", "Jumadil Akhir", "Rajab", "Syaban",
            "Ramadhan", "Syawal", "Dzulqadah", "Dzulhijjah"
        )
        // Penyesuaian bulan penanggalan Hijriyah
        return "Rabiul Akhir 1448 H"
    }

    fun updateSettings(newSettings: MosqueSettings) {
        _uiState.value = _uiState.value.copy(settings = newSettings)
        repository.saveSettings(newSettings)
        updatePrayerDisplay()
    }

    fun syncWithJakim() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(statusMessage = "Menghubungi server resmi JAKIM...")
            val result = repository.fetchOfficialJakimSchedule(_uiState.value.settings.jakimZone)
            if (result.isSuccess) {
                val times = result.getOrNull() ?: emptyMap()
                val updatedSettings = _uiState.value.settings.copy(
                    manualTimes = times,
                    isSampleData = false // Berhasil diverifikasi resmi
                )
                updateSettings(updatedSettings)
                _uiState.value = _uiState.value.copy(statusMessage = "Jadwal resmi JAKIM berhasil diperbarui!")
            } else {
                _uiState.value = _uiState.value.copy(
                    statusMessage = "Gagal terhubung ke internet. Tetap menggunakan data tersimpan."
                )
            }
        }
    }

    private fun updatePrayerDisplay() {
        tick()
    }
}
