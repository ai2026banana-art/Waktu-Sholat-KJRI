package com.masjid.jadwalsholat.ui

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
import kotlinx.coroutines.delay

data class QuranVerseData(
    val surah: String,
    val arabic: String,
    val translation: String,
    val mosqueName: String,
    val mosqueLocation: String
)

/**
 * Mockup UI Layar Papan Jadwal Sholat Digital Masjid (Landscape 16:9 Fullscreen TV).
 * Tata Letak Baru Sesuai Permintaan:
 * - Jam tidak perlu besar, diletakkan DI ATAS "Kuching, Sarawak"
 * - Sebelah KIRI separuh layar (50%): Kotak Ayat Al-Qur'an dengan wallpaper masjid ikonik dunia yang bertukar-tukar
 * - Sebelah KANAN separuh layar (50%):
 *   * KANAN ATAS: Kotak waktu sholat (1 sholat di atas [Asar], 2 di tengah [Subuh & Zohor], 2 di bawah [Maghrib & Isyak])
 *   * KANAN BAWAH: Kotak laporan keuangan masjid bulanan
 */
@Composable
fun PrayerTimesScreen(
    uiState: ScreenUiState,
    onOpenSettings: () -> Unit
) {
    val quranVerses = remember {
        listOf(
            QuranVerseData(
                surah = "QS. Al-Baqarah: 261",
                arabic = "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ مِّائَةُ حَبَّةٍ",
                translation = "“Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai; pada setiap tangkai ada seratus biji.”",
                mosqueName = "Masjid Nabawi",
                mosqueLocation = "Madinah Al-Munawwarah"
            ),
            QuranVerseData(
                surah = "QS. Al-Baqarah: 45",
                arabic = "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ",
                translation = "“Dan mohonlah pertolongan (kepada Allah) dengan sabar dan sholat. Dan sesungguhnya yang demikian itu sungguh berat, kecuali bagi orang-orang yang khusyuk.”",
                mosqueName = "Masjidil Haram & Ka'bah",
                mosqueLocation = "Makkah Al-Mukarramah"
            ),
            QuranVerseData(
                surah = "QS. Al-Isra: 78",
                arabic = "أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ وَقُرْآنَ الْفَجْرِ ۖ إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا",
                translation = "“Dirikanlah sholat sejak matahari tergelincir sampai gelapnya malam dan sholat Subuh. Sungguh, sholat Subuh disaksikan malaikat.”",
                mosqueName = "Kubah As-Sakhrah (Al-Aqsa)",
                mosqueLocation = "Al-Quds, Palestina"
            ),
            QuranVerseData(
                surah = "QS. Ar-Ra'd: 28",
                arabic = "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
                translation = "“Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.”",
                mosqueName = "Masjid Sultan Ahmed",
                mosqueLocation = "Istanbul, Turki"
            )
        )
    }

    var currentVerseIndex by remember { mutableStateOf(0) }

    // Efek ganti ayat & wallpaper masjid otomatis setiap 4 menit (240 detik)
    LaunchedEffect(Unit) {
        while (true) {
            delay(240_000L) // 4 menit
            currentVerseIndex = (currentVerseIndex + 1) % quranVerses.size
        }
    }

    val activeVerse = quranVerses[currentVerseIndex]

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(WarmCreamBg)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // =========================================================
            // 1. HEADER ATAS: Jam Sedang di Atas "Kuching, Sarawak"
            // =========================================================
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .fillMaxHeight(0.14f)
                    .background(Color(0xE6FFFFFF))
                    .padding(horizontal = 32.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Kiri: Nama Masjid
                Column {
                    Text(
                        text = "MASJID INDONESIA AS SYIFA",
                        color = TextDeepForest,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "KJRI Kuching, Sarawak, Malaysia",
                        color = TextMutedSage,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                // Tengah: JAM TIDAK PERLU BESAR, DI ATAS "Kuching, Sarawak"
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = "13:11",
                        color = TextDeepForest,
                        fontSize = 36.sp,
                        fontWeight = FontWeight.Black
                    )
                    Surface(
                        color = Color(0xFFF4F8F5),
                        shape = RoundedCornerShape(20.dp),
                        modifier = Modifier
                            .border(1.dp, Color(0xFFCFDED6), RoundedCornerShape(20.dp))
                            .padding(horizontal = 14.dp, vertical = 2.dp)
                    ) {
                        Text("Kuching, Sarawak", color = TextDeepForest, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }

                // Kanan: Tanggal
                Column(horizontalAlignment = Alignment.End) {
                    Text("Khamis, 15 Oktober 2026", color = TextDeepForest, fontSize = 17.sp, fontWeight = FontWeight.Bold)
                    Text("4 Rabiul Akhir 1448 H", color = PaleGold, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                }
            }

            Divider(color = Color(0x33E5CF96), thickness = 1.dp)

            // =========================================================
            // 2. BADAN UTAMA (86%): KIRI (50% AYAT) & KANAN (50% SHOLAT & KEUANGAN)
            // =========================================================
            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 32.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                // -----------------------------------------------------
                // SEPARUH LAYAR KIRI: KOTAK AYAT AL-QUR'AN (Wallpaper Berganti)
                // -----------------------------------------------------
                Surface(
                    color = Color(0xF7FFFFFF),
                    shape = RoundedCornerShape(24.dp),
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight()
                        .border(1.dp, PaleGoldBorder, RoundedCornerShape(24.dp))
                        .padding(20.dp)
                ) {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        // Header Ayat
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("AYAT AL-QUR’AN", color = Color(0xFF8C6B24), fontSize = 14.sp, fontWeight = FontWeight.ExtraBold)
                            Text(activeVerse.surah, color = Color(0xFF8C6B24), fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }

                        // Tulisan Arab Besar Rapi
                        Text(
                            text = activeVerse.arabic,
                            color = TextDeepForest,
                            fontSize = 26.sp,
                            lineHeight = 44.sp,
                            textAlign = TextAlign.Right,
                            modifier = Modifier.fillMaxWidth()
                        )

                        // Terjemahan
                        Text(
                            text = activeVerse.translation,
                            color = Color(0xFF234535),
                            fontSize = 15.sp,
                            lineHeight = 22.sp
                        )

                        // Watermark Wallpaper Masjid Ikonik Dunia
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("🕌 ${activeVerse.mosqueName} · ${activeVerse.mosqueLocation}", color = TextMutedSage, fontSize = 11.sp)
                            Text("Berganti Setiap 4 Menit", color = PaleGold, fontSize = 10.sp)
                        }
                    }
                }

                // -----------------------------------------------------
                // SEPARUH LAYAR KANAN: WAKTU SHOLAT (1-2-2) & KEUANGAN
                // -----------------------------------------------------
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxHeight(),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    // KANAN ATAS: KOTAK WAKTU SHOLAT (1 di atas, 2 di tengah, 2 di bawah)
                    Surface(
                        color = Color(0xF7FFFFFF),
                        shape = RoundedCornerShape(20.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1.1f)
                            .border(1.dp, PaleGoldBorder, RoundedCornerShape(20.dp))
                            .padding(14.dp)
                    ) {
                        Column(
                            modifier = Modifier.fillMaxSize(),
                            verticalArrangement = Arrangement.SpaceBetween
                        ) {
                            // 1 WAKTU SHOLAT DI ATAS (Asar - Sorot Emas & Hitung Mundur)
                            Surface(
                                color = PaleGoldCard,
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .border(1.5.dp, PaleGoldBorder, RoundedCornerShape(12.dp))
                                    .padding(horizontal = 14.dp, vertical = 8.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
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

                            // 2 WAKTU SHOLAT DI TENGAH (Subuh & Zohor)
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                MiniPrayerCard("SUBUH", "05:12", Modifier.weight(1f))
                                MiniPrayerCard("ZOHOR", "12:34", Modifier.weight(1f))
                            }

                            // 2 WAKTU SHOLAT DI BAWAH (Maghrib & Isyak)
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                MiniPrayerCard("MAGHRIB", "18:21", Modifier.weight(1f))
                                MiniPrayerCard("ISYAK", "19:32", Modifier.weight(1f))
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // KANAN BAWAH: KOTAK LAPORAN KEUANGAN
                    Surface(
                        color = Color(0xF7FFFFFF),
                        shape = RoundedCornerShape(20.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(0.9f)
                            .border(1.dp, PaleGoldBorder, RoundedCornerShape(20.dp))
                            .padding(14.dp)
                    ) {
                        Column(
                            modifier = Modifier.fillMaxSize(),
                            verticalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("LAPORAN KEUANGAN — OKTOBER 2026", color = Color(0xFF8C6B24), fontSize = 11.sp, fontWeight = FontWeight.ExtraBold)
                                Text("Diperbarui: 15 Okt 2026", color = TextMutedSage, fontSize = 9.sp)
                            }

                            // Dana Bulan Sebelumnya
                            Row(modifier = Modifier.fillMaxWidth().background(Color(0xFFF6F9F7), RoundedCornerShape(6.dp)).padding(horizontal = 8.dp, vertical = 2.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Dana Bulan Sebelumnya:", color = Color(0xFF365949), fontSize = 10.sp)
                                Text("RM 8,240", color = TextDeepForest, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }

                            // 4 Kotak Jumat
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                listOf("M1" to "RM 1,420", "M2" to "RM 1,580", "M3" to "RM 1,350", "M4" to "RM 1,650").forEach { (m, v) ->
                                    Column(modifier = Modifier.weight(1f).background(Color(0xFFF7FAF8), RoundedCornerShape(4.dp)).padding(vertical = 2.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text("Jumat $m", color = TextMutedSage, fontSize = 8.sp)
                                        Text(v, color = TextDeepForest, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }

                            // Pengeluaran & Total Kas
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
}

@Composable
fun MiniPrayerCard(
    name: String,
    time: String,
    modifier: Modifier = Modifier
) {
    Surface(
        color = Color(0x99FFFFFF),
        shape = RoundedCornerShape(10.dp),
        modifier = modifier.border(1.dp, Color(0x66DFD6C4), RoundedCornerShape(10.dp)).padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(name, color = Color(0xFF456B5A), fontSize = 10.sp, fontWeight = FontWeight.Bold)
            Text(time, color = TextDeepForest, fontSize = 18.sp, fontWeight = FontWeight.Black)
        }
    }
}
