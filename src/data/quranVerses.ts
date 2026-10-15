export interface QuranVerse {
  id: number;
  surah: string;
  theme: string;
  arabic: string;
  translation: string;
}

export const QURAN_VERSES: QuranVerse[] = [
  {
    id: 1,
    surah: 'QS. Al-Baqarah: 261',
    theme: 'Keberkahan Infak & Sedekah',
    arabic: 'مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ مِّائَةُ حَبَّةٍ',
    translation: '“Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai; pada setiap tangkai ada seratus biji.”',
  },
  {
    id: 2,
    surah: 'QS. Al-Baqarah: 45',
    theme: 'Sabar & Sholat',
    arabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ',
    translation: '“Dan mohonlah pertolongan (kepada Allah) dengan sabar dan sholat. Dan sesungguhnya yang demikian itu sungguh berat, kecuali bagi orang-orang yang khusyuk.”',
  },
  {
    id: 3,
    surah: 'QS. Al-Isra: 78',
    theme: 'Menjaga Waktu Sholat',
    arabic: 'أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ وَقُرْآنَ الْفَجْرِ ۖ إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا',
    translation: '“Dirikanlah sholat sejak matahari tergelincir sampai gelapnya malam dan (dirikanlah pula sholat) Subuh. Sungguh, sholat Subuh itu disaksikan (oleh malaikat).”',
  },
  {
    id: 4,
    surah: 'QS. Ar-Ra’d: 28',
    theme: 'Ketenangan Hati dalam Mengingat Allah',
    arabic: 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    translation: '“(Yaitu) orang-orang yang beriman dan hati mereka menjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.”',
  },
  {
    id: 5,
    surah: 'QS. Ali ‘Imran: 134',
    theme: 'Berinfak dalam Lapang & Sempit',
    arabic: 'الَّذِينَ يُنفِقُونَ فِي السَّرَّاءِ وَالضَّرَّاءِ وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ ۗ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ',
    translation: '“(Yaitu) orang-orang yang berinfak, baik di waktu lapang maupun sempit, dan orang-orang yang menahan amarahnya dan memaafkan (kesalahan) orang lain. Allah mencintai orang yang berbuat kebaikan.”',
  },
  {
    id: 6,
    surah: 'QS. Al-Ankabut: 45',
    theme: 'Sholat Mencegah Kemungkaran',
    arabic: 'اتْلُ مَا أُوحِيَ إِلَيْكَ مِنَ الْكِتَابِ وَأَقِمِ الصَّلَاةَ ۖ إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ',
    translation: '“Bacalah Kitab yang telah diwahyukan kepadamu dan laksanakanlah sholat. Sesungguhnya sholat itu mencegah dari perbuatan keji dan mungkar.”',
  },
  {
    id: 7,
    surah: 'QS. At-Talaq: 2-3',
    theme: 'Rezeki Tak Disangka-sangka',
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    translation: '“Barangsiapa bertakwa kepada Allah niscaya Dia akan membukakan jalan keluar baginya, dan menganugerahkan rezeki dari arah yang tidak disangka-sangka.”',
  },
  {
    id: 8,
    surah: 'QS. Al-Jumu’ah: 9',
    theme: 'Panggilan Sholat Jumat',
    arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ وَذَرُوا الْبَيْعَ',
    translation: '“Wahai orang-orang yang beriman! Apabila telah diseru untuk melaksanakan sholat pada hari Jumat, maka segeralah kamu mengingat Allah dan tinggalkanlah jual beli.”',
  },
];
