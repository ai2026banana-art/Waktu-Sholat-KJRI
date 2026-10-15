export interface IconicMosque {
  id: number;
  name: string;
  location: string;
  skyGradient: string;
  silhouetteColor: string;
  accentGold: string;
  domeStyle:
    | 'jamek_kl'
    | 'likas_sabah'
    | 'shah_alam'
    | 'haram'
    | 'turkish_garden'
    | 'sheikh_zayed'
    | 'brunei'
    | 'istanbul';
  tagline: string;
}

export const ICONIC_MOSQUES: IconicMosque[] = [
  {
    id: 1,
    name: 'Masjid Jamek Sultan Abdul Samad',
    location: 'Kuala Lumpur, Malaysia',
    skyGradient: 'from-[#d8ecf8] via-[#eef6fa] to-[#fbf9f4]',
    silhouetteColor: '#934e32',
    accentGold: '#d4af37',
    domeStyle: 'jamek_kl',
    tagline: 'Arsitektur Moorish klasik dengan air mancur marmer & kubah putih elegan',
  },
  {
    id: 2,
    name: 'Masjid Bandaraya Kota Kinabalu (Likas)',
    location: 'Sabah, Malaysia (Borneo)',
    skyGradient: 'from-[#cde4f2] via-[#e2eff7] to-[#eef6f8]',
    silhouetteColor: '#255e78',
    accentGold: '#38bdf8',
    domeStyle: 'likas_sabah',
    tagline: 'Masjid terapung megah dengan pantulan cermin danau laguna yang tenang',
  },
  {
    id: 3,
    name: 'Masjid Sultan Salahuddin Abdul Aziz Shah',
    location: 'Shah Alam, Selangor, Malaysia',
    skyGradient: 'from-[#e27d42] via-[#f59e0b] to-[#1e3a5f]',
    silhouetteColor: '#1d4ed8',
    accentGold: '#f59e0b',
    domeStyle: 'shah_alam',
    tagline: 'Masjid Biru termegah dengan 4 menara menjulang di waktu senja keemasan',
  },
  {
    id: 4,
    name: 'Masjidil Haram & Ka’bah Suci',
    location: 'Makkah Al-Mukarramah, Arab Saudi',
    skyGradient: 'from-[#1a1235] via-[#241a4a] to-[#0f172a]',
    silhouetteColor: '#334155',
    accentGold: '#eab308',
    domeStyle: 'haram',
    tagline: 'Pusat kiblat umat Islam sedunia dengan cahaya lampu malam yang berkilau',
  },
  {
    id: 5,
    name: 'Masjid Arsitektur Ottoman Biru & Kolam Air Mancur',
    location: 'Taman Bunga & Kaligrafi Islami',
    skyGradient: 'from-[#cde7f8] via-[#e5f2fa] to-[#f5fbf7]',
    silhouetteColor: '#2b6cb0',
    accentGold: '#d4af37',
    domeStyle: 'turkish_garden',
    tagline: 'Kubah biru bertingkat dengan kolam air mancur bening & bunga-bunga asri',
  },
  {
    id: 6,
    name: 'Masjid Agung Sheikh Zayed',
    location: 'Abu Dhabi, Uni Emirat Arab',
    skyGradient: 'from-[#fef3c7] via-[#fde68a] to-[#dbeafe]',
    silhouetteColor: '#475569',
    accentGold: '#ca8a04',
    domeStyle: 'sheikh_zayed',
    tagline: '82 kubah marmer putih murni berkilau emas di taman hijau senja',
  },
  {
    id: 7,
    name: 'Masjid Sultan Omar Ali Saifuddien',
    location: 'Bandar Seri Begawan, Brunei Darussalam',
    skyGradient: 'from-[#bae6fd] via-[#e0f2fe] to-[#fef9c3]',
    silhouetteColor: '#0284c7',
    accentGold: '#facc15',
    domeStyle: 'brunei',
    tagline: 'Kubah emas murni & replika perahu mahligai abad ke-16 di danau cermin',
  },
  {
    id: 8,
    name: 'Masjid Sultan Ahmed (Blue Mosque)',
    location: 'Istanbul, Turki',
    skyGradient: 'from-[#93c5fd] via-[#bfdbfe] to-[#fed7aa]',
    silhouetteColor: '#3b82f6',
    accentGold: '#f59e0b',
    domeStyle: 'istanbul',
    tagline: 'Pemandangan senja dengan 6 menara ramping di tepi perairan Selat Bosporus',
  },
];
