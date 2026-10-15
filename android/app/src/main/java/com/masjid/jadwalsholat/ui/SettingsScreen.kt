package com.masjid.jadwalsholat.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.masjid.jadwalsholat.data.MosqueSettings
import com.masjid.jadwalsholat.data.PrayerType
import com.masjid.jadwalsholat.ui.theme.DeepEmerald
import com.masjid.jadwalsholat.ui.theme.SoftGold

/**
 * Halaman Pengaturan untuk Pengurus Masjid As Syafir KJRI Kuching.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    currentSettings: MosqueSettings,
    onSaveSettings: (MosqueSettings) -> Unit,
    onSyncJakim: () -> Unit,
    onClose: () -> Unit
) {
    var mosqueName by remember { mutableStateOf(currentSettings.mosqueName) }
    var subtitle by remember { mutableStateOf(currentSettings.subtitle) }
    var announcement by remember { mutableStateOf(currentSettings.announcement) }
    var selectedZone by remember { mutableStateOf(currentSettings.jakimZone) }
    var isSampleData by remember { mutableStateOf(currentSettings.isSampleData) }
    var enableIqamah by remember { mutableStateOf(currentSettings.enableIqamah) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Pengaturan Pengurus Masjid", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onClose) {
                        Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Kembali")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = DeepEmerald,
                    titleContentColor = SoftGold,
                    navigationIconContentColor = Color.White
                )
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(Color(0xFF041F18))
                .padding(20.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                text = "Identitas Masjid",
                color = SoftGold,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )

            OutlinedTextField(
                value = mosqueName,
                onValueChange = { mosqueName = it },
                label = { Text("Nama Masjid") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    focusedBorderColor = SoftGold,
                    unfocusedBorderColor = Color.Gray
                )
            )

            OutlinedTextField(
                value = subtitle,
                onValueChange = { subtitle = it },
                label = { Text("Keterangan Lokasi") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    focusedBorderColor = SoftGold,
                    unfocusedBorderColor = Color.Gray
                )
            )

            Divider(color = Color(0xFF0F4D3D))

            Text(
                text = "Zona Waktu & Jadwal JAKIM",
                color = SoftGold,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )

            Text(
                text = "Zona resmi untuk KJRI Kuching: SWK08 (Kuching, Bau, Lundu, Sematan)",
                color = Color.LightGray,
                fontSize = 14.sp
            )

            OutlinedTextField(
                value = selectedZone,
                onValueChange = { selectedZone = it },
                label = { Text("Kode Zona JAKIM (e.g. SWK08)") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    focusedBorderColor = SoftGold,
                    unfocusedBorderColor = Color.Gray
                )
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Gunakan status 'Data Contoh'",
                    color = Color.White,
                    fontSize = 14.sp
                )
                Switch(
                    checked = isSampleData,
                    onCheckedChange = { isSampleData = it }
                )
            }

            Button(
                onClick = onSyncJakim,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0D5E48)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Sinkronkan Sekarang via API Resmi JAKIM", color = Color.White)
            }

            Divider(color = Color(0xFF0F4D3D))

            Text(
                text = "Pengumuman Masjid (Teks Berjalan)",
                color = SoftGold,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )

            OutlinedTextField(
                value = announcement,
                onValueChange = { announcement = it },
                label = { Text("Teks Pengumuman") },
                modifier = Modifier.fillMaxWidth(),
                minLines = 2,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    focusedBorderColor = SoftGold,
                    unfocusedBorderColor = Color.Gray
                )
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Aktifkan Hitung Mundur Iqamah",
                    color = Color.White,
                    fontSize = 14.sp
                )
                Switch(
                    checked = enableIqamah,
                    onCheckedChange = { enableIqamah = it }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Tombol Simpan
            Button(
                onClick = {
                    val updated = currentSettings.copy(
                        mosqueName = mosqueName,
                        subtitle = subtitle,
                        announcement = announcement,
                        jakimZone = selectedZone,
                        isSampleData = isSampleData,
                        enableIqamah = enableIqamah
                    )
                    onSaveSettings(updated)
                    onClose()
                },
                colors = ButtonDefaults.buttonColors(containerColor = SoftGold),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Simpan Pengaturan", color = Color.Black, fontWeight = FontWeight.Bold)
            }
        }
    }
}
