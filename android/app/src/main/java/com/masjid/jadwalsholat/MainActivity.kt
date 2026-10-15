package com.masjid.jadwalsholat

import android.os.Bundle
import android.view.WindowManager
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.runtime.*
import com.masjid.jadwalsholat.ui.PrayerTimesScreen
import com.masjid.jadwalsholat.ui.SettingsScreen
import com.masjid.jadwalsholat.ui.theme.JadwalSholatTheme
import com.masjid.jadwalsholat.viewmodel.PrayerTimesViewModel

/**
 * Activity Utama untuk Papan Jadwal Sholat Digital Masjid As Syafir KJRI Kuching.
 * Mengaktifkan FLAG_KEEP_SCREEN_ON agar layar TV tidak pernah mati/sleep otomatis.
 */
class MainActivity : ComponentActivity() {

    private val viewModel: PrayerTimesViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Pastikan layar TV/Tablet masjid selalu menyala terus menerus
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        setContent {
            val uiState by viewModel.uiState.collectAsState()
            var isSettingsOpen by remember { mutableStateOf(false) }

            JadwalSholatTheme(darkTheme = uiState.settings.isDarkTheme) {
                if (isSettingsOpen) {
                    SettingsScreen(
                        currentSettings = uiState.settings,
                        onSaveSettings = { newSettings ->
                            viewModel.updateSettings(newSettings)
                        },
                        onSyncJakim = {
                            viewModel.syncWithJakim()
                        },
                        onClose = { isSettingsOpen = false }
                    )
                } else {
                    PrayerTimesScreen(
                        uiState = uiState,
                        onOpenSettings = { isSettingsOpen = true }
                    )
                }
            }
        }
    }
}
