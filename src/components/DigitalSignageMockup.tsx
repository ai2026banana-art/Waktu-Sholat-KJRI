import React, { useState, useEffect } from 'react';
import { MosqueBackdrop } from './MosqueBackdrop';
import { MosqueWallpaperCard } from './MosqueWallpaperCard';
import { PrayerTimeRightGrid } from './PrayerTimeRightGrid';
import { FinancialReportCard } from './FinancialReportCard';
import { MasjidLogo } from './MasjidLogo';
import {
  FridayOfficersCard,
  FridayOfficersData,
  DEFAULT_FRIDAY_OFFICERS,
} from './FridayOfficersCard';
import { FridayOfficersModal } from './FridayOfficersModal';
import {
  PrayerHijriAdjustModal,
  PrayerScheduleState,
  HijriDateState,
} from './PrayerHijriAdjustModal';
import { MosquePhotoModal } from './MosquePhotoModal';
import {
  UploadedMosquePhoto,
  getAllUploadedPhotos,
  getActivePhotoId,
  setActivePhotoId,
  getAutoRotatePhotos,
  setAutoRotatePhotos,
  compressImage,
  savePhoto,
} from '../services/photoStorage';
import { QURAN_VERSES, QuranVerse } from '../data/quranVerses';
import {
  DEFAULT_FINANCIAL_REPORT,
  MonthlyFinancialReport,
} from '../data/financialData';
import {
  Maximize2,
  Minimize2,
  Sliders,
  Moon,
  Clock,
  Sparkles,
  Image as ImageIcon,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  calculateDynamicPrayers,
  DynamicPrayerCalculation,
  FardhuPrayerKey,
} from '../services/prayerTimeCalculator';
import { TimeSimulationModal } from './TimeSimulationModal';

interface DigitalSignageMockupProps {
  onOpenAndroidCode?: () => void;
  onOpenSettings?: () => void;
}

const DEFAULT_SCHEDULE: PrayerScheduleState = {
  subuh: '05:12',
  zohor: '12:34',
  asar: '15:45',
  maghrib: '18:21',
  isyak: '19:32',
  imsak: '05:02',
  syuruk: '06:28',
};

const DEFAULT_HIJRI: HijriDateState = {
  day: 4,
  monthName: 'Rabiul Akhir',
  year: 1448,
  dayOffset: 0,
  gregorianDateText: 'Khamis, 15 Oktober 2026',
};

export const DigitalSignageMockup: React.FC<DigitalSignageMockupProps> = ({
  onOpenAndroidCode,
  onOpenSettings,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoShift, setIsAutoShift] = useState(true);
  const [simulatedTime, setSimulatedTime] = useState<string | null>(null);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

  // Adjustable Prayer Times & Hijri Calendar State (with LocalStorage cache)
  const [schedule, setSchedule] = useState<PrayerScheduleState>(() => {
    try {
      const saved = localStorage.getItem('masjid_as_syafir_schedule');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_SCHEDULE;
  });

  // Dynamic Prayer Calculation State
  const [prayerCalc, setPrayerCalc] = useState<DynamicPrayerCalculation>(() => {
    return calculateDynamicPrayers(schedule || DEFAULT_SCHEDULE, new Date());
  });

  const [liveTime, setLiveTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [liveSeconds, setLiveSeconds] = useState(() => {
    return String(new Date().getSeconds()).padStart(2, '0');
  });
  const [liveCountdown, setLiveCountdown] = useState(() => {
    return calculateDynamicPrayers(schedule || DEFAULT_SCHEDULE, new Date()).countdownFormatted;
  });

  const [hijriDate, setHijriDate] = useState<HijriDateState>(() => {
    try {
      const saved = localStorage.getItem('masjid_as_syafir_hijri');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_HIJRI;
  });

  const [activePrayerKey, setActivePrayerKey] = useState<FardhuPrayerKey>(() => {
    return calculateDynamicPrayers(schedule || DEFAULT_SCHEDULE, new Date()).nextPrayerKey;
  });
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // Save schedule changes
  const handleSaveSchedule = (newSchedule: PrayerScheduleState) => {
    setSchedule(newSchedule);
    try {
      localStorage.setItem('masjid_as_syafir_schedule', JSON.stringify(newSchedule));
    } catch {
      // ignore
    }
  };

  // Save Hijri changes
  const handleSaveHijri = (newHijri: HijriDateState) => {
    setHijriDate(newHijri);
    try {
      localStorage.setItem('masjid_as_syafir_hijri', JSON.stringify(newHijri));
    } catch {
      // ignore
    }
  };

  // Rotasi Ayat & Wallpaper Masjid Setiap 4 Menit (240 Detik)
  const ROTATION_SECONDS = 240;
  const [verseIndex, setVerseIndex] = useState(0);
  const [secondsUntilNextVerse, setSecondsUntilNextVerse] = useState(ROTATION_SECONDS);
  const [isVerseFading, setIsVerseFading] = useState(false);

  // Financial Report State
  const [financialData, setFinancialData] = useState<MonthlyFinancialReport>(() => {
    try {
      const saved = localStorage.getItem('masjid_as_syafir_finance');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_FINANCIAL_REPORT;
  });
  const [isEditFinanceOpen, setIsEditFinanceOpen] = useState(false);

  // Friday Officers State (Imam, Khatib & Bilal - Editable per Friday)
  const [fridayOfficers, setFridayOfficers] = useState<FridayOfficersData>(() => {
    try {
      const saved = localStorage.getItem('masjid_as_syafir_officers');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_FRIDAY_OFFICERS;
  });
  const [isEditOfficersOpen, setIsEditOfficersOpen] = useState(false);

  const handleSaveOfficers = (newOfficers: FridayOfficersData) => {
    setFridayOfficers(newOfficers);
    try {
      localStorage.setItem('masjid_as_syafir_officers', JSON.stringify(newOfficers));
    } catch {
      // ignore
    }
    setIsEditOfficersOpen(false);
  };

  const handleSaveFinance = (newFinance: MonthlyFinancialReport) => {
    setFinancialData(newFinance);
    try {
      localStorage.setItem('masjid_as_syafir_finance', JSON.stringify(newFinance));
    } catch {
      // ignore
    }
    setIsEditFinanceOpen(false);
  };

  // State untuk Foto Wallpaper Masjid Unggahan
  const [photos, setPhotos] = useState<UploadedMosquePhoto[]>([]);
  const [activePhotoId, setActivePhotoIdState] = useState<string | null>(null);
  const [autoRotatePhotos, setAutoRotatePhotosState] = useState<boolean>(true);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Muat foto-foto yang tersimpan di IndexedDB saat pertama dibuka
  useEffect(() => {
    let isMounted = true;
    getAllUploadedPhotos().then((loaded) => {
      if (!isMounted) return;
      setPhotos(loaded);
      const savedActiveId = getActivePhotoId();
      if (savedActiveId && loaded.some((p) => p.id === savedActiveId)) {
        setActivePhotoIdState(savedActiveId);
      } else if (loaded.length > 0) {
        setActivePhotoIdState(loaded[0].id);
        setActivePhotoId(loaded[0].id);
      }
      setAutoRotatePhotosState(getAutoRotatePhotos());
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const activePhoto: UploadedMosquePhoto | null =
    photos.find((p) => p.id === activePhotoId) || (photos.length > 0 ? photos[0] : null);

  // Penanganan Unggah Cepat dari File Input
  const handleQuickUpload = async (files: FileList) => {
    const newPhotos: UploadedMosquePhoto[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      try {
        const { dataUrl, sizeKB } = await compressImage(file, 1920, 1080, 0.85);
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const newPhoto: UploadedMosquePhoto = {
          id: `photo-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
          name: cleanName || `Foto Masjid ${photos.length + i + 1}`,
          dataUrl,
          uploadedAt: Date.now(),
          sizeKB,
        };
        await savePhoto(newPhoto);
        newPhotos.push(newPhoto);
      } catch {
        // ignore
      }
    }
    if (newPhotos.length > 0) {
      const updated = [...newPhotos, ...photos];
      setPhotos(updated);
      const firstId = newPhotos[0].id;
      setActivePhotoId(firstId);
      setActivePhotoIdState(firstId);
    }
  };

  const currentVerse: QuranVerse = QURAN_VERSES[verseIndex % QURAN_VERSES.length];

  // 1. Timer Rotasi Otomatis Ayat Al-Qur'an & Pergantian Foto Wallpaper Masjid Setiap 4 Menit
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilNextVerse((prev) => {
        if (prev <= 1) {
          setIsVerseFading(true);
          setTimeout(() => {
            setVerseIndex((current) => (current + 1) % QURAN_VERSES.length);

            // Jika rotasi otomatis foto aktif dan ada lebih dari 1 foto yang diunggah
            if (autoRotatePhotos && photos.length > 1) {
              setActivePhotoIdState((currId) => {
                const curIdx = photos.findIndex((p) => p.id === currId);
                const nextIdx = (curIdx + 1) % photos.length;
                const nextId = photos[nextIdx].id;
                setActivePhotoId(nextId);
                return nextId;
              });
            }

            setIsVerseFading(false);
          }, 350);
          return ROTATION_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [ROTATION_SECONDS, autoRotatePhotos, photos]);

  // Navigasi Manual
  const handlePrevVerse = () => {
    setIsVerseFading(true);
    setTimeout(() => {
      setVerseIndex((current) => (current === 0 ? QURAN_VERSES.length - 1 : current - 1));
      setSecondsUntilNextVerse(ROTATION_SECONDS);
      setIsVerseFading(false);
    }, 200);
  };

  const handleNextVerse = () => {
    setIsVerseFading(true);
    setTimeout(() => {
      setVerseIndex((current) => (current + 1) % QURAN_VERSES.length);
      setSecondsUntilNextVerse(ROTATION_SECONDS);
      setIsVerseFading(false);
    }, 200);
  };

  // Perhitungan Jam Nyata, Simulasi Waktu, dan Perpindahan Otomatis Waktu Sholat Terdekat
  useEffect(() => {
    const updateTick = () => {
      const now = new Date();
      let activeDate = now;

      if (simulatedTime) {
        const [sh, sm] = simulatedTime.split(':').map(Number);
        // Tanggal hari ini dengan jam & menit yang disimulasikan (dan detik berjalan)
        activeDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          sh,
          sm,
          now.getSeconds()
        );
      }

      const h = String(activeDate.getHours()).padStart(2, '0');
      const m = String(activeDate.getMinutes()).padStart(2, '0');
      const s = String(activeDate.getSeconds()).padStart(2, '0');
      setLiveTime(`${h}:${m}`);
      setLiveSeconds(s);

      // Hitung waktu sholat terdekat, hitung mundur, dan urutan siklus 5 waktu sholat
      const dynamic = calculateDynamicPrayers(schedule, activeDate);
      setPrayerCalc(dynamic);
      setLiveCountdown(dynamic.countdownFormatted);

      // Jika mode otomatis aktif, sinkronkan activePrayerKey ke waktu sholat terdekat
      if (isAutoShift) {
        setActivePrayerKey(dynamic.nextPrayerKey);
      }
    };

    updateTick();
    const interval = setInterval(updateTick, 1000);
    return () => clearInterval(interval);
  }, [schedule, isAutoShift, simulatedTime]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const rotateMinutes = Math.floor(secondsUntilNextVerse / 60);
  const rotateSecs = secondsUntilNextVerse % 60;
  const rotationTimeStr = `${rotateMinutes}:${String(rotateSecs).padStart(2, '0')}`;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#f7f5ef] text-[#1b3528] flex flex-col justify-between font-sans select-none">
      {/* 1. Latar Belakang Artistik Masjid Lembut */}
      <MosqueBackdrop activePhotoUrl={activePhoto?.dataUrl} />

      {/* Floating Toolbar Minimalis */}
      <div className="absolute top-2.5 right-4 z-40 flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
        {/* Tombol Kelola Foto Masjid Unggahan */}
        <button
          onClick={() => setIsPhotoModalOpen(true)}
          title="Kelola & Unggah Foto Wallpaper Masjid (Disimpan di Aplikasi)"
          className="px-2.5 py-1 rounded-lg bg-white/85 hover:bg-white text-[11px] font-semibold text-[#2c5341] border border-[#d2dfd7] shadow-xs backdrop-blur-sm cursor-pointer transition-colors flex items-center gap-1.5"
        >
          <ImageIcon className="w-3.5 h-3.5 text-[#c59e4b]" />
          <span>Foto Masjid ({photos.length})</span>
        </button>

        {/* Tombol Atur Waktu & Hilal */}
        <button
          onClick={() => setIsAdjustModalOpen(true)}
          title="Ubah Waktu Sholat & Penyesuaian Hilal Bulan Islam"
          className="px-2.5 py-1 rounded-lg bg-[#fef7e6] hover:bg-[#fdf0cf] text-[11px] font-bold text-[#8d6a22] border border-[#edd7a2] shadow-xs backdrop-blur-sm cursor-pointer transition-colors flex items-center gap-1.5"
        >
          <Moon className="w-3.5 h-3.5 text-[#c59e4b]" />
          <span>Atur Waktu & Hilal</span>
        </button>

        {/* Tombol Edit Kas */}
        <button
          onClick={() => setIsEditFinanceOpen(true)}
          title="Ubah Data Kas Keuangan Masjid"
          className="px-2.5 py-1 rounded-lg bg-white/85 hover:bg-white text-[11px] font-semibold text-[#2c5341] border border-[#d2dfd7] shadow-xs backdrop-blur-sm cursor-pointer transition-colors flex items-center gap-1"
        >
          <Sliders className="w-3 h-3 text-[#c59e4b]" />
          <span>Edit Kas</span>
        </button>

        {/* Tombol Uji Waktu & Mode Jam Nyata */}
        <button
          onClick={() => setIsTimeModalOpen(true)}
          title="Uji Waktu Sholat (Misal 16:23) & Mode Jam Nyata"
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border shadow-xs backdrop-blur-sm cursor-pointer transition-colors flex items-center gap-1.5 ${
            simulatedTime
              ? 'bg-[#fef5df] hover:bg-[#fdedc7] text-[#8c6b24] border-[#ecd59d]'
              : 'bg-white/85 hover:bg-white text-[#2c5341] border-[#d2dfd7]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#c59e4b]" />
          <span>{simulatedTime ? `Uji Jam: ${simulatedTime}` : 'Jam: Live'}</span>
        </button>

        {onOpenAndroidCode && (
          <button
            onClick={onOpenAndroidCode}
            title="Lihat Kode Android Native Jetpack Compose"
            className="px-2.5 py-1 rounded-lg bg-white/85 hover:bg-white text-[11px] font-bold text-[#2c5341] border border-[#d2dfd7] shadow-xs backdrop-blur-sm cursor-pointer transition-colors"
          >
            Kode Android
          </button>
        )}

        {/* Tombol Fullscreen TV */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh TV (16:9)'}
          className="p-1.5 rounded-lg bg-white/85 hover:bg-white text-[#2c5341] border border-[#d2dfd7] shadow-xs backdrop-blur-sm cursor-pointer transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* ============================================================== */}
      {/* HEADER BAR (14% TINGGI LAYAR):                                  */}
      {/* KIRI: Logo Masjid di samping "MASJID INDONESIA ASS SYAFIR"      */}
      {/* TENGAH: Jam Sedang di atas "Kuching, Sarawak"                  */}
      {/* KANAN: Hari, Tanggal Masehi & Tanggal Hijriah (Adjustable)      */}
      {/* ============================================================== */}
      <header className="relative z-10 w-full h-[14vh] px-8 md:px-12 flex items-center justify-between border-b border-[#e5ded0]/70 backdrop-blur-[8px] bg-white/65 shrink-0">
        {/* Kiri: Logo Masjid & Nama Masjid */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-3.5">
            {/* Logo Masjid Vektor Resmi di samping Nama Masjid */}
            <div className="relative group cursor-pointer" onClick={() => setIsAdjustModalOpen(true)} title="Masjid Indonesia As Syafir · KJRI Kuching">
              <MasjidLogo size={52} className="drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl md:text-[23px] font-black tracking-wide text-[#143224] uppercase font-sans">
                  MASJID INDONESIA AS SYAFIR
                </h1>
              </div>
              <p className="text-xs sm:text-xs font-bold text-[#4d7363] tracking-wide mt-0.5">
                KJRI Kuching, Sarawak, Malaysia
              </p>
            </div>
          </div>
        </div>

        {/* Tengah: JAM TIDAK PERLU BESAR, DILETAKKAN DI ATAS "Kuching, Sarawak" */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {/* Jam Digital Sedang Proporsional */}
          <div className="flex items-baseline gap-1 text-[#152e22] drop-shadow-xs">
            <span className="font-mono font-black text-3xl sm:text-4xl tracking-tight">
              {liveTime}
            </span>
            <span className="font-mono font-bold text-lg text-[#c59e4b]">
              :{liveSeconds}
            </span>
          </div>

          {/* Tepat di bawah jam: "Kuching, Sarawak" dan info simulasi jika aktif */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#f4f8f5] border border-[#cfded6] shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4a836a]" />
              <span className="text-xs sm:text-xs font-bold tracking-wide text-[#234535]">
                Kuching, Sarawak
              </span>
            </div>

            {simulatedTime && (
              <button
                onClick={() => setSimulatedTime(null)}
                title="Klik untuk kembali ke Waktu Nyata"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fef5df] hover:bg-[#fdedc7] text-[#8c6b24] text-[10px] font-bold border border-[#ecd59d] cursor-pointer transition-colors shadow-xs"
              >
                <span>Uji: {simulatedTime}</span>
                <span className="text-amber-700">✕ Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Kanan: Hari, Tanggal Masehi & Tanggal Hijriah (Dapat Disesuaikan / Adjustable Hilal) */}
        <div
          onClick={() => setIsAdjustModalOpen(true)}
          className="flex-1 text-right cursor-pointer group"
          title="Klik untuk menyesuaikan tanggal Hijriah (Rukyatul Hilal)"
        >
          <span className="text-base sm:text-lg md:text-xl font-bold tracking-wide text-[#1c382b] block group-hover:text-[#12281e] transition-colors">
            {hijriDate.gregorianDateText}
          </span>
          <div className="flex items-center justify-end gap-1.5 mt-0.5">
            <span className="text-xs sm:text-xs text-[#8c6b24] font-black tracking-wider group-hover:underline">
              {hijriDate.day} {hijriDate.monthName} {hijriDate.year} H
            </span>
            {hijriDate.dayOffset !== 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#fef5df] text-[#8c6b24] font-bold border border-[#ecd59d]">
                Hilal {hijriDate.dayOffset > 0 ? `+${hijriDate.dayOffset}` : hijriDate.dayOffset}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* BADAN UTAMA (86% TINGGI LAYAR):                                 */}
      {/* SEBELAH KIRI SEPARUH LAYAR (50%): KOTAK AYAT AL-QUR'AN         */}
      {/* BERWALLPAPER GAMBAR MASJID IKONIK DUNIA ISLAM YANG BERTUKAR2   */}
      {/*                                                                */}
      {/* SEBELAH KANAN SEPARUH LAYAR (50%):                             */}
      {/* - ATAS: KOTAK WAKTU SHOLAT (1 ATAS, 2 TENGAH, 2 BAWAH)        */}
      {/* - BAWAH: KOTAK LAPORAN KEUANGAN MASJID PER BULAN               */}
      {/* ============================================================== */}
      <main className="relative z-10 w-full h-[86vh] px-8 md:px-12 py-3 flex items-stretch gap-6 overflow-hidden">
        {/* ------------------------------------------------------------ */}
        {/* SEBELAH KIRI SEPARUH LAYAR: KOTAK AYAT AL-QUR'AN              */}
        {/* BERWALLPAPER FOTO-FOTO MASJID YANG DIUNGGAH PENGGUNA          */}
        {/* ------------------------------------------------------------ */}
        <div className="w-1/2 h-full flex flex-col">
          <MosqueWallpaperCard
            verse={currentVerse}
            verseIndex={verseIndex}
            totalVerses={QURAN_VERSES.length}
            rotationTimeStr={rotationTimeStr}
            isFading={isVerseFading}
            onPrev={handlePrevVerse}
            onNext={handleNextVerse}
            photos={photos}
            activePhoto={activePhoto}
            onSelectPhotoId={(id) => {
              setActivePhotoId(id);
              setActivePhotoIdState(id);
            }}
            onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
            onQuickUpload={handleQuickUpload}
          />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* SEBELAH KANAN SEPARUH LAYAR:                                  */}
        {/* 1. ATAS: KOTAK WAKTU SHOLAT (1 ATAS, 2 TENGAH, 2 BAWAH)       */}
        {/* 2. TENGAH: KOTAK IMAM, KHATIB & BILAL (FORMAT TAB, EDITABLE) */}
        {/* 3. BAWAH: KOTAK LAPORAN KEUANGAN MASJID PER BULAN             */}
        {/* ------------------------------------------------------------ */}
        <div className="w-1/2 h-full flex flex-col justify-between gap-2.5">
          {/* 1. Kotak Kanan Atas: Jadwal Waktu Sholat 1 di atas, 2 di tengah, 2 di bawah */}
          <div className="shrink-0">
            <PrayerTimeRightGrid
              schedule={schedule}
              activePrayerKey={activePrayerKey}
              countdownStr={liveCountdown}
              orderedPrayers={prayerCalc.orderedPrayers}
              isTomorrow={prayerCalc.isTomorrow}
              onOpenAdjustModal={() => setIsAdjustModalOpen(true)}
            />
          </div>

          {/* 2. Kotak Kanan Tengah: Petugas Solat Jumaat (Imam, Khatib & Bilal) Tabbed */}
          <div className="shrink-0">
            <FridayOfficersCard
              data={fridayOfficers}
              onEdit={() => setIsEditOfficersOpen(true)}
            />
          </div>

          {/* 3. Kotak Kanan Bawah: Laporan Keuangan Masjid Bulanan */}
          <div className="shrink-0">
            <FinancialReportCard
              report={financialData}
              onEdit={() => setIsEditFinanceOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* ============================================================== */}
      {/* MODAL 1: PENGATURAN WAKTU SHOLAT & PENYESUAIAN HILAL BULAN ISLAM*/}
      {/* ============================================================== */}
      <PrayerHijriAdjustModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        schedule={schedule}
        onSaveSchedule={handleSaveSchedule}
        hijriDate={hijriDate}
        onSaveHijriDate={handleSaveHijri}
        activePrayerKey={activePrayerKey}
        onSetActivePrayerKey={setActivePrayerKey}
        isAutoShift={isAutoShift}
        onSetAutoShift={setIsAutoShift}
      />

      {/* ============================================================== */}
      {/* MODAL KHUSUS: UJI & SIMULASI JAM SHOLAT (MISAL 16:23)          */}
      {/* ============================================================== */}
      <TimeSimulationModal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        simulatedTime={simulatedTime}
        onSetSimulatedTime={(t) => setSimulatedTime(t)}
        schedule={schedule}
        currentDisplayTime={`${liveTime}:${liveSeconds}`}
      />

      {/* ============================================================== */}
      {/* MODAL 2: UBAH PETUGAS SOLAT JUMAAT (IMAM, KHATIB, BILAL)       */}
      {/* ============================================================== */}
      <FridayOfficersModal
        isOpen={isEditOfficersOpen}
        onClose={() => setIsEditOfficersOpen(false)}
        data={fridayOfficers}
        onSave={handleSaveOfficers}
      />

      {/* ============================================================== */}
      {/* MODAL 2: EDIT LAPORAN KEUANGAN BULANAN UNTUK PENGURUS MASJID   */}
      {/* ============================================================== */}
      {isEditFinanceOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#faf8f4] border border-[#d4af37]/60 rounded-3xl w-full max-w-lg p-5 shadow-2xl text-[#1a382b]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5ded0]">
              <h3 className="font-extrabold text-base text-[#8c6b24]">
                Atur Laporan Keuangan Bulanan Masjid
              </h3>
              <button
                onClick={() => setIsEditFinanceOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-[#eae2d3] flex items-center justify-center text-[#5c8271] hover:text-[#1a382b]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 py-4 text-xs">
              <div>
                <label className="block text-[#476e5c] font-bold mb-1">Bulan & Tahun Periode</label>
                <input
                  type="text"
                  value={financialData.periodMonth}
                  onChange={(e) => setFinancialData({ ...financialData, periodMonth: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#cfded6] text-[#1c382b]"
                />
              </div>

              <div>
                <label className="block text-[#476e5c] font-bold mb-1">Dana dari Bulan Sebelumnya (RM)</label>
                <input
                  type="number"
                  value={financialData.previousMonthBalance}
                  onChange={(e) => setFinancialData({ ...financialData, previousMonthBalance: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#cfded6] text-[#1c382b] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#476e5c] font-bold mb-1">Infaq Jumat Minggu 1 (RM)</label>
                  <input
                    type="number"
                    value={financialData.fridayWeek1}
                    onChange={(e) => setFinancialData({ ...financialData, fridayWeek1: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#cfded6] text-[#1c382b] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#476e5c] font-bold mb-1">Infaq Jumat Minggu 2 (RM)</label>
                  <input
                    type="number"
                    value={financialData.fridayWeek2}
                    onChange={(e) => setFinancialData({ ...financialData, fridayWeek2: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#cfded6] text-[#1c382b] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#476e5c] font-bold mb-1">Infaq Jumat Minggu 3 (RM)</label>
                  <input
                    type="number"
                    value={financialData.fridayWeek3}
                    onChange={(e) => setFinancialData({ ...financialData, fridayWeek3: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#cfded6] text-[#1c382b] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#476e5c] font-bold mb-1">Infaq Jumat Minggu 4 (RM)</label>
                  <input
                    type="number"
                    value={financialData.fridayWeek4}
                    onChange={(e) => setFinancialData({ ...financialData, fridayWeek4: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#cfded6] text-[#1c382b] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#991b1b] font-bold mb-1">Pengeluaran Bulanan (RM)</label>
                <input
                  type="number"
                  value={financialData.monthlyExpenses}
                  onChange={(e) => setFinancialData({ ...financialData, monthlyExpenses: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#f5d0d0] text-[#991b1b] font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e5ded0]">
              <button
                onClick={() => setIsEditFinanceOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#5c8271] hover:bg-[#eae2d3]"
              >
                Batal
              </button>
              <button
                onClick={() => handleSaveFinance(financialData)}
                className="px-4 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#c5a02e] text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Selesai & Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal Pengelola Foto Wallpaper Masjid */}
      <MosquePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        photos={photos}
        activePhotoId={activePhotoId}
        autoRotate={autoRotatePhotos}
        onPhotoSelected={(id) => {
          setActivePhotoId(id);
          setActivePhotoIdState(id);
        }}
        onPhotosUpdated={(newPhotos) => {
          setPhotos(newPhotos);
        }}
        onAutoRotateToggled={(enabled) => {
          setAutoRotatePhotosState(enabled);
          setAutoRotatePhotos(enabled);
        }}
      />
    </div>
  );
};
