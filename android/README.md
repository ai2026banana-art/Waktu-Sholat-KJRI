# Panduan Kompilasi & Pengujian Android Native: "Jadwal Sholat Masjid"

Aplikasi ini dibuat khusus untuk papan jadwal sholat digital **Masjid As Syafir (KJRI Kuching, Sarawak, Malaysia)** menggunakan **Kotlin** dan **Jetpack Compose**.

---

## 1. Lokasi & Verifikasi Jadwal Resmi
- **Lokasi Masjid**: As Syafir, KJRI Kuching, Sarawak, Malaysia
- **Zona Waktu**: `Asia/Kuching` (UTC+8)
- **Zona Jadwal Resmi JAKIM**: **Zon 8 Sarawak (`SWK08`)** yang mencakup wilayah:
  - Kuching
  - Bau
  - Lundu
  - Sematan
- **Peringatan Data Contoh**: Jika baru pertama kali dibuka dan belum terhubung ke jadwal resmi terverifikasi, aplikasi menampilkan banner:
  > **"DATA CONTOH — belum untuk penggunaan nyata"**
- Setelah pengurus memverifikasi jadwal dengan jadwal resmi Jabatan Kemajuan Islam Malaysia (JAKIM) atau mencocokkannya dengan takwim KJRI, status data contoh dapat dinonaktifkan di menu Pengaturan.

---

## 2. Cara Membuka & Membangun (Build) Menjadi APK

### Langkah-langkah di Komputer Pengurus/Pengembang:
1. **Unduh atau Salin Folder Android**:
   - Salin seluruh folder `/android` ke komputer Anda.
2. **Buka di Android Studio**:
   - Jalankan Android Studio (versi Ladybug / Iguana / Jellyfish atau lebih baru).
   - Pilih menu **File > Open**, lalu arahkan ke folder `android`.
   - Tunggu Android Studio menyelesaikan sinkronisasi Gradle (biasanya 1–2 menit).
3. **Membangun File APK (Build APK)**:
   - Klik menu **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - Setelah selesai, klik notifikasi **"locate"** untuk menemukan file `app-debug.apk`.
   - File APK ini siap diinstal ke:
     - Android Smart TV / Android TV Box (Mi Box, Chromecast with Google TV, dsb.)
     - Tablet Android yang dipasang di dinding masjid
     - HP Android pengurus untuk pratinjau

---

## 3. Fitur Utama Display TV Masjid
1. **Layar Tetap Menyala (`FLAG_KEEP_SCREEN_ON`)**: Layar TV masjid tidak akan pernah mati (sleep) otomatis saat menampilkan jadwal.
2. **Hitung Mundur Cerdas**:
   - Menghitung mundur menuju waktu sholat berikutnya (Subuh, Zohor, Asar, Maghrib, Isyak).
   - Setelah Isyak, otomatis menghitung mundur menuju Subuh hari berikutnya.
3. **Tahan Gangguan Internet (Offline-First)**:
   - Jadwal tersimpan di penyimpanan lokal perangkat (`SharedPreferences`).
   - Jika koneksi WiFi masjid mati, jadwal tetap tampil sempurna tanpa error.
4. **Mode Iqamah Otomatis**:
   - Menampilkan hitung mundur waktu jeda antara adzan dan iqamah per waktu sholat.
5. **Teks Pengumuman Berjalan (Marquee)**:
   - Pengurus dapat mengubah isi pesan pengumuman langsung dari menu pengaturan.

---

## 4. Struktur Kode Sumber
- `MainActivity.kt`: Entry point dengan konfigurasi layar penuh dan wake-lock.
- `PrayerTimesScreen.kt`: Tampilan utama papan digital TV (jam besar, hitung mundur, kartu waktu sholat, pengumuman).
- `SettingsScreen.kt`: Halaman pengaturan untuk pengurus masjid.
- `PrayerTimesRepository.kt`: Pengelola sumber data offline/online dan sinkronisasi JAKIM SWK08.
- `PrayerTimesViewModel.kt`: Mesin perhitungan waktu, ticker detik hemat daya, dan hitung mundur.
