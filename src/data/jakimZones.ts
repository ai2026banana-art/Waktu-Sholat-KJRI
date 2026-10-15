import { JakimZoneInfo } from '../types/prayer';

export const JAKIM_SARAWAK_ZONES: JakimZoneInfo[] = [
  {
    code: 'SWK08',
    state: 'Sarawak',
    description: 'Zon 8: Kuching, Bau, Lundu, Sematan (Lokasi KJRI Kuching / Masjid As Syafir)',
  },
  {
    code: 'SWK01',
    state: 'Sarawak',
    description: 'Zon 1: Limbang, Lawas, Sundar, Trusan',
  },
  {
    code: 'SWK02',
    state: 'Sarawak',
    description: 'Zon 2: Miri, Niah, Bekenu, Sibuti, Marudi',
  },
  {
    code: 'SWK03',
    state: 'Sarawak',
    description: 'Zon 3: Pandan, Belaga, Suai, Tatau, Sebauh, Bintulu',
  },
  {
    code: 'SWK04',
    state: 'Sarawak',
    description: 'Zon 4: Sibu, Mukah, Dalat, Song, Kanowit, Kapit',
  },
  {
    code: 'SWK05',
    state: 'Sarawak',
    description: 'Zon 5: Sarikei, Matu, Julau, Rajang, Daro, Bintangor, Belawai',
  },
  {
    code: 'SWK06',
    state: 'Sarawak',
    description: 'Zon 6: Lubok Antu, Sri Aman, Roban, Debak, Betong, Saratok, Kabong',
  },
  {
    code: 'SWK07',
    state: 'Sarawak',
    description: 'Zon 7: Serian, Simunjan, Samarahan, Sebuyau, Meludam',
  },
  {
    code: 'SWK09',
    state: 'Sarawak',
    description: 'Zon 9: Zon Khas (Telok Melano)',
  },
  {
    code: 'WLY01',
    state: 'Wilayah Persekutuan',
    description: 'Kuala Lumpur, Putrajaya',
  },
];

export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Kuching', label: 'Asia/Kuching (Sarawak, Malaysia - UTC+8)' },
  { value: 'Asia/Kuala_Lumpur', label: 'Asia/Kuala_Lumpur (Semenanjung - UTC+8)' },
  { value: 'Asia/Pontianak', label: 'Asia/Pontianak (Kalimantan Barat, Indonesia - UTC+7)' },
  { value: 'Asia/Jakarta', label: 'Asia/Jakarta (WIB - UTC+7)' },
];

/**
 * Baseline sample prayer schedule for Kuching (SWK08)
 * Explicitly labeled as sample data as required:
 * "Jika sumber data jadwal belum tersedia, jangan mengarang waktu sholat.
 * Tampilkan contoh data dengan label 'DATA CONTOH — belum untuk penggunaan nyata'"
 */
export const SAMPLE_PRAYER_TIMES = {
  imsak: '05:00',
  subuh: '05:10',
  syuruk: '06:22',
  zohor: '12:31',
  asar: '15:42',
  maghrib: '18:34',
  isyak: '19:43',
};
