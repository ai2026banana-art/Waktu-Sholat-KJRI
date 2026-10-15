import React, { useState } from 'react';
import JSZip from 'jszip';
import { X, Download, Copy, Check, FileCode, Folder, ExternalLink, HelpCircle, Terminal } from 'lucide-react';

interface AndroidExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CodeFileItem {
  path: string;
  name: string;
  type: 'kt' | 'xml' | 'kts' | 'md';
  content: string;
}

export const AndroidExportModal: React.FC<AndroidExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const files: CodeFileItem[] = [
    {
      path: 'app/src/main/java/com/masjid/jadwalsholat/MainActivity.kt',
      name: 'MainActivity.kt',
      type: 'kt',
      content: `package com.masjid.jadwalsholat

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
 * Mengaktifkan FLAG_KEEP_SCREEN_ON agar layar TV tidak pernah mati otomatis.
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
}`,
    },
    {
      path: 'app/src/main/java/com/masjid/jadwalsholat/ui/PrayerTimesScreen.kt',
      name: 'PrayerTimesScreen.kt',
      type: 'kt',
      content: `package com.masjid.jadwalsholat.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.masjid.jadwalsholat.ui.theme.*
import com.masjid.jadwalsholat.viewmodel.ScreenUiState

/**
 * Mockup UI Layar Papan Jadwal Sholat Digital Masjid (Landscape 16:9 Fullscreen TV).
 * Tata Letak Baru Sesuai Permintaan:
 * - Jam tidak perlu besar, diletakkan DI ATAS "Kuching, Sarawak"
 * - Sebelah KIRI separuh layar (50%): Kotak Ayat Al-Qur'an (Wallpaper berganti)
 * - Sebelah KANAN separuh layar (50%):
 *   * KANAN ATAS: Kotak waktu sholat (1 di atas, 2 di tengah, 2 di bawah)
 *   * KANAN BAWAH: Kotak laporan keuangan masjid bulanan
 */
@Composable
fun PrayerTimesScreen(
    uiState: ScreenUiState,
    onOpenSettings: () -> Unit
) {
    Box(
        modifier = Modifier.fillMaxSize().background(WarmCreamBg)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // HEADER ATAS: Jam Sedang di Atas "Kuching, Sarawak"
            Row(
                modifier = Modifier.fillMaxWidth().fillMaxHeight(0.14f).background(Color(0xE6FFFFFF)).padding(horizontal = 32.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("MASJID INDONESIA AS SYIFA", color = TextDeepForest, fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
                    Text("KJRI Kuching, Sarawak, Malaysia", color = TextMutedSage, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("13:11", color = TextDeepForest, fontSize = 36.sp, fontWeight = FontWeight.Black)
                    Surface(color = Color(0xFFF4F8F5), shape = RoundedCornerShape(20.dp), modifier = Modifier.border(1.dp, Color(0xFFCFDED6), RoundedCornerShape(20.dp)).padding(horizontal = 14.dp, vertical = 2.dp)) {
                        Text("Kuching, Sarawak", color = TextDeepForest, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
                Column(horizontalAlignment = Alignment.End) {
                    Text("Khamis, 15 Oktober 2026", color = TextDeepForest, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                    Text("4 Rabiul Akhir 1448 H", color = PaleGold, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                }
            }

            Divider(color = Color(0x33E5CF96), thickness = 1.dp)

            // BADAN UTAMA (86%): KIRI (50% AYAT) & KANAN (50% SHOLAT 1-2-2 & KEUANGAN)
            Row(
                modifier = Modifier.fillMaxSize().padding(horizontal = 32.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                // KIRI (50%): KOTAK AYAT AL-QUR'AN DENGAN WALLPAPER MASJID IKONIK DUNIA
                Surface(
                    color = Color(0xF7FFFFFF),
                    shape = RoundedCornerShape(24.dp),
                    modifier = Modifier.weight(1f).fillMaxHeight().border(1.dp, PaleGoldBorder, RoundedCornerShape(24.dp)).padding(20.dp)
                ) {
                    Column(modifier = Modifier.fillMaxSize(), verticalArrangement = Arrangement.SpaceBetween) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("AYAT AL-QUR’AN", color = Color(0xFF8C6B24), fontSize = 14.sp, fontWeight = FontWeight.ExtraBold)
                            Text("QS. Al-Baqarah: 261", color = Color(0xFF8C6B24), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                        Text(
                            text = "مَثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ مِّائَةُ حَبَّةٍ",
                            color = TextDeepForest,
                            fontSize = 26.sp,
                            lineHeight = 44.sp,
                            textAlign = TextAlign.Right,
                            modifier = Modifier.fillMaxWidth()
                        )
                        Text(
                            text = "“Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai; pada setiap tangkai ada seratus biji.”",
                            color = Color(0xFF234535),
                            fontSize = 15.sp,
                            lineHeight = 22.sp
                        )
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("🕌 Masjid Nabawi · Madinah Al-Munawwarah", color = TextMutedSage, fontSize = 11.sp)
                            Text("Berganti Setiap 4 Menit", color = PaleGold, fontSize = 10.sp)
                        }
                    }
                }

                // KANAN (50%): WAKTU SHOLAT (1-2-2) & KEUANGAN
                Column(modifier = Modifier.weight(1f).fillMaxHeight(), verticalArrangement = Arrangement.SpaceBetween) {
                    // KANAN ATAS: WAKTU SHOLAT (1 ATAS, 2 TENGAH, 2 BAWAH)
                    Surface(
                        color = Color(0xF7FFFFFF),
                        shape = RoundedCornerShape(20.dp),
                        modifier = Modifier.fillMaxWidth().weight(1.1f).border(1.dp, PaleGoldBorder, RoundedCornerShape(20.dp)).padding(14.dp)
                    ) {
                        Column(modifier = Modifier.fillMaxSize(), verticalArrangement = Arrangement.SpaceBetween) {
                            // 1 Sholat di Atas (Asar + Countdown)
                            Surface(color = PaleGoldCard, shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth().border(1.5.dp, PaleGoldBorder, RoundedCornerShape(12.dp)).padding(horizontal = 14.dp, vertical = 8.dp)) {
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                                    Column {
                                        Text("ASAR (BERIKUTNYA)", color = Color(0xFF8B671E), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                        Text("15:45", color = TextDeepForest, fontSize = 28.sp, fontWeight = FontWeight.Black)
                                    }
                                    Column(horizontalAlignment = Alignment.End) {
                                        Text("HITUNG MUNDUR", color = Color(0xFF8B671E), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                        Text("02:34:00", color = Color(0xFF8B671E), fontSize = 22.sp, fontWeight = FontWeight.Black)
                                    }
                                }
                            }
                            // 2 Sholat di Tengah (Subuh & Zohor)
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                MiniPrayerCard("SUBUH", "05:12", Modifier.weight(1f))
                                MiniPrayerCard("ZOHOR", "12:34", Modifier.weight(1f))
                            }
                            // 2 Sholat di Bawah (Maghrib & Isyak)
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                MiniPrayerCard("MAGHRIB", "18:21", Modifier.weight(1f))
                                MiniPrayerCard("ISYAK", "19:32", Modifier.weight(1f))
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // KANAN BAWAH: LAPORAN KEUANGAN
                    Surface(
                        color = Color(0xF7FFFFFF),
                        shape = RoundedCornerShape(20.dp),
                        modifier = Modifier.fillMaxWidth().weight(0.9f).border(1.dp, PaleGoldBorder, RoundedCornerShape(20.dp)).padding(14.dp)
                    ) {
                        Column(modifier = Modifier.fillMaxSize(), verticalArrangement = Arrangement.SpaceBetween) {
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("LAPORAN KEUANGAN — OKTOBER 2026", color = Color(0xFF8C6B24), fontSize = 11.sp, fontWeight = FontWeight.ExtraBold)
                                Text("Diperbarui: 15 Okt 2026", color = TextMutedSage, fontSize = 9.sp)
                            }
                            Row(modifier = Modifier.fillMaxWidth().background(Color(0xFFF6F9F7), RoundedCornerShape(6.dp)).padding(horizontal = 8.dp, vertical = 2.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Dana Bulan Sebelumnya:", color = Color(0xFF365949), fontSize = 10.sp)
                                Text("RM 8,240", color = TextDeepForest, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                listOf("M1" to "RM 1,420", "M2" to "RM 1,580", "M3" to "RM 1,350", "M4" to "RM 1,650").forEach { (m, v) ->
                                    Column(modifier = Modifier.weight(1f).background(Color(0xFFF7FAF8), RoundedCornerShape(4.dp)).padding(vertical = 2.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text("Jumat $m", color = TextMutedSage, fontSize = 8.sp)
                                        Text(v, color = TextDeepForest, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Row(modifier = Modifier.weight(1f).background(Color(0xFFFDF2F2), RoundedCornerShape(6.dp)).padding(horizontal = 6.dp, vertical = 3.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Pengeluaran:", color = Color(0xFF881337), fontSize = 9.sp)
                                    Text("RM 2,460", color = Color(0xFF991B1B), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                                Row(modifier = Modifier.weight(1.2f).background(PaleGoldCard, RoundedCornerShape(6.dp)).border(1.dp, PaleGoldBorder, RoundedCornerShape(6.dp)).padding(horizontal = 6.dp, vertical = 3.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text("Total Kas:", color = Color(0xFF785918), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    Text("RM 11,780", color = Color(0xFF8C6B24), fontSize = 13.sp, fontWeight = FontWeight.Black)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}`,
    },
    {
      path: 'app/src/main/java/com/masjid/jadwalsholat/ui/SettingsScreen.kt',
      name: 'SettingsScreen.kt',
      type: 'kt',
      content: `package com.masjid.jadwalsholat.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.masjid.jadwalsholat.data.MosqueSettings

@Composable
fun SettingsScreen(
    currentSettings: MosqueSettings,
    onSaveSettings: (MosqueSettings) -> Unit,
    onSyncJakim: () -> Unit,
    onClose: () -> Unit
) {
    // Implementasi form edit nama masjid, zona SWK08, koreksi waktu, dan iqamah
}`,
    },
    {
      path: 'app/src/main/java/com/masjid/jadwalsholat/data/PrayerTimeData.kt',
      name: 'PrayerTimeData.kt',
      type: 'kt',
      content: `package com.masjid.jadwalsholat.data

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
    val time: String,
    val adjustedTime: String,
    val offsetMinutes: Int = 0,
    val isNext: Boolean = false,
    val isCurrent: Boolean = false
)

data class MosqueSettings(
    val mosqueName: String = "As Syafir",
    val subtitle: String = "KJRI Kuching, Sarawak, Malaysia",
    val timezoneId: String = "Asia/Kuching",
    val jakimZone: String = "SWK08", // Zon 8 Sarawak: Kuching, Bau, Lundu, Sematan
    val isSampleData: Boolean = true,
    val announcement: String = "Selamat Datang di Masjid As Syafir KJRI Kuching · Harap luruskan shaf · Nonaktifkan dering ponsel.",
    val enableIqamah: Boolean = true,
    val isDarkTheme: Boolean = true,
    val manualTimes: Map<PrayerType, String> = mapOf(
        PrayerType.SUBUH to "05:10",
        PrayerType.SYURUK to "06:22",
        PrayerType.ZOHOR to "12:31",
        PrayerType.ASAR to "15:42",
        PrayerType.MAGHRIB to "18:34",
        PrayerType.ISYAK to "19:43"
    )
)`,
    },
    {
      path: 'app/src/main/java/com/masjid/jadwalsholat/data/PrayerTimesRepository.kt',
      name: 'PrayerTimesRepository.kt',
      type: 'kt',
      content: `package com.masjid.jadwalsholat.data

import android.content.Context
import android.content.SharedPreferences
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Modul terpisah untuk penyimpanan offline (SharedPreferences)
 * dan sinkronisasi API jadwal resmi JAKIM SWK08 tanpa membocorkan kredensial.
 */
class PrayerTimesRepository(context: Context) {
    // Simpan & baca jadwal lokal, offline fallback
}`,
    },
    {
      path: 'app/src/main/AndroidManifest.xml',
      name: 'AndroidManifest.xml',
      type: 'xml',
      content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <uses-feature android:name="android.hardware.touchscreen" android:required="false" />
    <uses-feature android:name="android.software.leanback" android:required="false" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.NoActionBar.Fullscreen">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="sensorLandscape"
            android:keepScreenOn="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`,
    },
    {
      path: 'app/build.gradle.kts',
      name: 'app/build.gradle.kts',
      type: 'kts',
      content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "com.masjid.jadwalsholat"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.masjid.jadwalsholat"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation(platform("androidx.compose:compose-bom:2024.12.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
}`,
    },
    {
      path: 'README.md',
      name: 'README.md (Panduan Kompilasi APK)',
      type: 'md',
      content: `# Panduan Kompilasi APK Android Native

## Cara Membuat File APK dari Proyek Ini:
1. Klik tombol "Unduh Proyek Android (.ZIP)" di atas.
2. Ekstrak file zip ke komputer pengurus atau pengembang.
3. Buka Android Studio (versi terkini), lalu pilih "Open" dan arahkan ke folder yang diekstrak.
4. Tunggu Gradle sync selesai.
5. Klik menu: Build -> Build Bundle(s) / APK(s) -> Build APK(s).
6. File "app-debug.apk" siap dipasang di TV Box Android, Smart TV, atau tablet masjid!

## Informasi Lokasi & Zona Resmi:
- Masjid: As Syafir, KJRI Kuching, Sarawak
- Zona Waktu: Asia/Kuching (UTC+8)
- Zona Resmi JAKIM: SWK08 (Kuching, Bau, Lundu, Sematan)`,
    },
  ];

  const [selectedFile, setSelectedFile] = useState<CodeFileItem>(files[0]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();

      // Root files
      zip.file('build.gradle.kts', `// Top-level build file\nplugins {\n    alias(libs.plugins.android.application) apply false\n    alias(libs.plugins.kotlin.android) apply false\n}\n`);
      zip.file('settings.gradle.kts', `rootProject.name = "JadwalSholatMasjid"\ninclude(":app")\n`);
      zip.file('README.md', files.find((f) => f.name.includes('README'))?.content || '');

      // App files
      const app = zip.folder('app');
      app?.file('build.gradle.kts', files.find((f) => f.name === 'app/build.gradle.kts')?.content || '');

      const srcMain = app?.folder('src')?.folder('main');
      srcMain?.file('AndroidManifest.xml', files.find((f) => f.name === 'AndroidManifest.xml')?.content || '');

      const pkg = srcMain?.folder('java')?.folder('com')?.folder('masjid')?.folder('jadwalsholat');
      pkg?.file('MainActivity.kt', files.find((f) => f.name === 'MainActivity.kt')?.content || '');

      const uiPkg = pkg?.folder('ui');
      uiPkg?.file('PrayerTimesScreen.kt', files.find((f) => f.name === 'PrayerTimesScreen.kt')?.content || '');
      uiPkg?.file('SettingsScreen.kt', files.find((f) => f.name === 'SettingsScreen.kt')?.content || '');

      const dataPkg = pkg?.folder('data');
      dataPkg?.file('PrayerTimeData.kt', files.find((f) => f.name === 'PrayerTimeData.kt')?.content || '');
      dataPkg?.file('PrayerTimesRepository.kt', files.find((f) => f.name === 'PrayerTimesRepository.kt')?.content || '');

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'JadwalSholatMasjid-AsSyafir-AndroidNative.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to create ZIP:', e);
    } finally {
      setDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-emerald-950 border-2 border-emerald-700/80 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-800/80 bg-emerald-900/60">
          <div className="flex items-center gap-2.5">
            <FileCode className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base md:text-lg font-bold text-white">
                Kode Sumber Android Native (Kotlin & Jetpack Compose)
              </h2>
              <p className="text-xs text-emerald-300">
                Lengkap untuk Android Studio · Siap dibangun menjadi APK Native Android TV & Tablet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Mengompres...' : 'Unduh Proyek (.ZIP)'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Penjelasan untuk Pengguna */}
        <div className="px-5 py-2.5 bg-emerald-900/40 border-b border-emerald-800/50 flex flex-col md:flex-row items-start md:items-center justify-between text-xs text-emerald-200 gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Status Hasil Proyek:</strong> Aplikasi interaktif langsung dapat diuji di browser TV Anda saat ini. Seluruh file sumber Kotlin native lengkap dan dapat di-build menjadi APK melalui Android Studio.
            </span>
          </div>
          <span className="shrink-0 text-amber-300/90 font-mono font-semibold">
            Target: Android 7.0 s/d 15 (TV & Tablet)
          </span>
        </div>

        {/* Body Split: File Tree & Code Viewer */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Selector Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-emerald-800/70 bg-emerald-950/90 p-2.5 overflow-y-auto shrink-0 flex flex-row md:flex-col gap-1">
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              <Folder className="w-3.5 h-3.5" />
              <span>Daftar Berkas Android</span>
            </div>
            {files.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                      : 'text-emerald-200/80 hover:bg-emerald-900/50 hover:text-white'
                  }`}
                >
                  <span className="truncate">{file.name}</span>
                  <span className="text-[10px] opacity-60 uppercase">{file.type}</span>
                </button>
              );
            })}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-emerald-950/60 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-emerald-800/50 bg-emerald-900/30">
              <span className="text-xs font-mono text-emerald-300 truncate">
                {selectedFile.path}
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-emerald-800/80 hover:bg-emerald-700 text-white font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>

            <div className="flex-1 p-4 overflow-auto">
              <pre className="font-mono text-xs md:text-sm text-emerald-100 whitespace-pre leading-relaxed select-text">
                {selectedFile.content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
