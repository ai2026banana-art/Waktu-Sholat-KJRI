import { MosqueConfig, PrayerItem, PrayerKey, PrayerStatus, CachedSchedulePayload } from '../types/prayer';
import { SAMPLE_PRAYER_TIMES } from '../data/jakimZones';

const STORAGE_KEY_CONFIG = 'masjid_as_syafir_config_v1';
const STORAGE_KEY_CACHE = 'masjid_as_syafir_schedule_cache_v1';

export const PRAYER_LABELS: Record<PrayerKey, { label: string; arabic: string }> = {
  imsak: { label: 'Imsak', arabic: 'الإمساك' },
  subuh: { label: 'Subuh', arabic: 'الفجر' },
  syuruk: { label: 'Syuruk', arabic: 'الشروق' },
  zohor: { label: 'Zohor', arabic: 'الظهر' },
  asar: { label: 'Asar', arabic: 'العصر' },
  maghrib: { label: 'Maghrib', arabic: 'المغرب' },
  isyak: { label: 'Isyak', arabic: 'العشاء' },
};

export function getDefaultConfig(): MosqueConfig {
  return {
    mosqueName: 'Indonesia As Syafir',
    subtitle: 'KJRI Kuching, Sarawak, Malaysia',
    timezone: 'Asia/Kuching',
    selectedZone: 'SWK08',
    selectedZoneName: 'Sarawak Zon 8 (Kuching, Bau, Lundu, Sematan)',
    sourceType: 'sample', // Defaults to sample data until verified as requested
    isSampleData: true,
    sampleDataNotice: 'DATA CONTOH — belum untuk penggunaan nyata',
    announcementText: 'Selamat Datang di Masjid Indonesia As Syafir KJRI Kuching · Harap luruskan dan rapatkan shaf sholat · Mohon nonaktifkan dering ponsel saat ibadah.',
    theme: 'emerald',
    enableIqamahCountdown: true,
    enableAudioBeep: true,
    showSyuruk: true,
    showImsak: false,
    showSeconds: true,
    pinCode: '1234',
    isPinEnabled: false,
    hijriDayOffset: 0,
    iqamahDurations: {
      imsak: 0,
      subuh: 12,
      syuruk: 0,
      zohor: 10,
      asar: 10,
      maghrib: 8,
      isyak: 10,
    },
    minuteCorrections: {
      imsak: 0,
      subuh: 0,
      syuruk: 0,
      zohor: 0,
      asar: 0,
      maghrib: 0,
      isyak: 0,
    },
    manualSchedule: { ...SAMPLE_PRAYER_TIMES },
  };
}

export function loadMosqueConfig(): MosqueConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...getDefaultConfig(), ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load config from storage, using defaults:', e);
  }
  return getDefaultConfig();
}

export function saveMosqueConfig(config: MosqueConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save mosque config:', e);
  }
}

export function loadCachedSchedule(): CachedSchedulePayload | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CACHE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to read schedule cache:', e);
  }
  return null;
}

export function saveCachedSchedule(payload: CachedSchedulePayload): void {
  try {
    localStorage.setItem(STORAGE_KEY_CACHE, JSON.stringify(payload));
  } catch (e) {
    console.error('Failed to cache schedule:', e);
  }
}

/**
 * Add or subtract minutes from "HH:mm"
 */
export function applyMinuteOffset(timeStr: string, offsetMinutes: number): string {
  if (!timeStr || !timeStr.includes(':')) return '00:00';
  const [hStr, mStr] = timeStr.split(':');
  let totalMinutes = parseInt(hStr, 10) * 60 + parseInt(mStr, 10) + offsetMinutes;
  
  // Wrap around 24 hours
  totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Converts "HH:mm" on a given base date into a Date object
 */
export function timeStringToDate(timeStr: string, baseDate: Date = new Date()): Date {
  const [h, m] = timeStr.split(':').map((v) => parseInt(v, 10));
  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * Format duration in seconds into HH:MM:SS or MM:SS
 */
export function formatCountdown(totalSeconds: number): string {
  if (totalSeconds < 0) totalSeconds = 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hStr = String(hours).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');

  return `${hStr}:${mStr}:${sStr}`;
}

/**
 * Modular prayer data provider for JAKIM e-Solat.
 * Kept strictly isolated so other official APIs can be plugged in easily.
 */
export async function fetchJakimPrayerTimes(zone: string = 'SWK08'): Promise<{
  success: boolean;
  times: Record<PrayerKey, string>;
  isSample: boolean;
  message: string;
}> {
  try {
    // Official / public proxy endpoint for JAKIM e-Solat (waktusolat.app or e-solat JAKIM)
    const url = `https://api.waktusolat.app/v2/solat/${encodeURIComponent(zone)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }

    const data = await response.json();
    if (data && Array.isArray(data.prayers) && data.prayers.length > 0) {
      // Find today's prayer times (epoch or day)
      const todayEntry = data.prayers[0]; // First entry or current day
      
      const formatTime = (epochSeconds: number): string => {
        const d = new Date(epochSeconds * 1000);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      };

      const times: Record<PrayerKey, string> = {
        imsak: todayEntry.imsak ? formatTime(todayEntry.imsak) : '05:00',
        subuh: formatTime(todayEntry.fajr),
        syuruk: formatTime(todayEntry.syuruk),
        zohor: formatTime(todayEntry.dhuhr),
        asar: formatTime(todayEntry.asr),
        maghrib: formatTime(todayEntry.maghrib),
        isyak: formatTime(todayEntry.isha),
      };

      return {
        success: true,
        times,
        isSample: false,
        message: `Berhasil memuat jadwal resmi JAKIM Zon ${zone}`,
      };
    }
    throw new Error('Format data tidak sesuai');
  } catch (err: any) {
    console.warn(`Gagal memuat jadwal online JAKIM (${err?.message || err}). Mencoba cache...`);
    
    // Check local cache
    const cached = loadCachedSchedule();
    if (cached && cached.prayers) {
      return {
        success: true,
        times: cached.prayers,
        isSample: cached.isSample,
        message: `Memuat dari penyimpanan lokal offline (Tersimpan: ${cached.savedAt})`,
      };
    }

    // Default to sample data with required warning
    return {
      success: false,
      times: { ...SAMPLE_PRAYER_TIMES },
      isSample: true,
      message: 'DATA CONTOH — belum untuk penggunaan nyata. Hubungkan internet atau atur manual.',
    };
  }
}

/**
 * Calculates current prayer, next prayer, and live countdown timer.
 */
export function calculatePrayerStatus(
  prayerItems: PrayerItem[],
  currentTime: Date,
  config: MosqueConfig
): PrayerStatus {
  // Ordered sequence for daily prayer tracking
  const scheduleKeys: PrayerKey[] = config.showSyuruk
    ? ['subuh', 'syuruk', 'zohor', 'asar', 'maghrib', 'isyak']
    : ['subuh', 'zohor', 'asar', 'maghrib', 'isyak'];

  const activeItems = prayerItems.filter((item) => scheduleKeys.includes(item.key));
  if (activeItems.length === 0) {
    throw new Error('No active prayer items found');
  }

  const currentSecondsOfDay =
    currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds();

  let nextItemIndex = -1;
  let currentItemIndex = -1;

  for (let i = 0; i < activeItems.length; i++) {
    const item = activeItems[i];
    const [h, m] = item.adjustedTime.split(':').map((v) => parseInt(v, 10));
    const itemSeconds = h * 3600 + m * 60;

    if (currentSecondsOfDay < itemSeconds) {
      nextItemIndex = i;
      break;
    } else {
      currentItemIndex = i;
    }
  }

  let nextPrayer: PrayerItem;
  let isTomorrowSubuh = false;
  let countdownSeconds = 0;

  if (nextItemIndex !== -1) {
    // Next prayer is today!
    nextPrayer = activeItems[nextItemIndex];
    const [h, m] = nextPrayer.adjustedTime.split(':').map((v) => parseInt(v, 10));
    const targetSeconds = h * 3600 + m * 60;
    countdownSeconds = targetSeconds - currentSecondsOfDay;
  } else {
    // Current time is after Isyak!
    // Next prayer is tomorrow's Subuh!
    isTomorrowSubuh = true;
    const subuhItem = activeItems.find((p) => p.key === 'subuh') || activeItems[0];
    nextPrayer = subuhItem;
    const [h, m] = subuhItem.adjustedTime.split(':').map((v) => parseInt(v, 10));
    const targetSecondsTomorrow = 86400 + (h * 3600 + m * 60);
    countdownSeconds = targetSecondsTomorrow - currentSecondsOfDay;
  }

  // Check Iqamah status for current prayer
  let isIqamahActive = false;
  let iqamahRemainingSeconds = 0;

  if (config.enableIqamahCountdown && currentItemIndex !== -1) {
    const currentItem = activeItems[currentItemIndex];
    // Exclude Syuruk & Imsak from Iqamah
    if (currentItem.key !== 'syuruk' && currentItem.key !== 'imsak') {
      const [curH, curM] = currentItem.adjustedTime.split(':').map((v) => parseInt(v, 10));
      const curSeconds = curH * 3600 + curM * 60;
      const elapsedSinceAdhan = currentSecondsOfDay - curSeconds;
      const iqamahDurationSec = (config.iqamahDurations[currentItem.key] || 10) * 60;

      if (elapsedSinceAdhan >= 0 && elapsedSinceAdhan < iqamahDurationSec) {
        isIqamahActive = true;
        iqamahRemainingSeconds = iqamahDurationSec - elapsedSinceAdhan;
      }
    }
  }

  return {
    currentPrayer: currentItemIndex !== -1 ? activeItems[currentItemIndex] : null,
    nextPrayer,
    countdownSeconds,
    countdownFormatted: formatCountdown(countdownSeconds),
    isTomorrowSubuh,
    isIqamahActive,
    iqamahRemainingSeconds,
    iqamahFormatted: formatCountdown(iqamahRemainingSeconds),
  };
}

/**
 * Gentle acoustic chime for Adhan / Iqamah alerts
 * Works directly in browser via Web Audio API without requiring any external mp3 files
 */
export function playGentleChime(type: 'adhan' | 'iqamah' | 'beep' = 'adhan') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      return;
    }

    // Melodic prayer chime (three ascending harmonic notes)
    const notes = type === 'adhan' ? [523.25, 659.25, 783.99] : [659.25, 523.25];
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.35;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.2);
    });
  } catch (e) {
    console.warn('Audio chime could not play (user interaction needed or audio disabled)', e);
  }
}

/**
 * Formats Gregorian & Hijri date representation in Indonesian/Malay
 * Supports rukyat hilal day offset (+/- hari) and custom manual date
 */
export function getFormattedDates(
  d: Date = new Date(),
  dayOffset: number = 0,
  customHijri?: { day?: number; month?: string; year?: number }
): {
  dayName: string;
  masehiDate: string;
  hijriDate: string;
} {
  const days = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayName = days[d.getDay()];
  const masehiDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

  // If customized manually by mosque administrator
  if (customHijri && customHijri.day && customHijri.month) {
    return {
      dayName,
      masehiDate,
      hijriDate: `${customHijri.day} ${customHijri.month} ${customHijri.year || 1448} H`,
    };
  }

  // Calculate with hilal offset
  const hijriDate = calculateApproxHijri(d, dayOffset);

  return { dayName, masehiDate, hijriDate };
}

function calculateApproxHijri(date: Date, dayOffset: number = 0): string {
  const hijriMonths = [
    'Muharram', 'Safar', 'Rabiul Awwal', 'Rabiul Akhir',
    'Jumadil Ula', 'Jumadil Akhir', 'Rajab', 'Syaban',
    'Ramadhan', 'Syawal', 'Dzulqadah', 'Dzulhijjah'
  ];

  // Apply dayOffset in milliseconds (1 day = 86400000 ms)
  const adjustedTime = date.getTime() + dayOffset * 86400000;
  const jd = Math.floor((adjustedTime + 86400000 * 2440587.5) / 86400000);
  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));
  l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  const mIndex = Math.max(0, Math.min(11, month - 1));
  return `${day} ${hijriMonths[mIndex]} ${year} H`;
}
