export type PrayerKey = 'imsak' | 'subuh' | 'syuruk' | 'zohor' | 'asar' | 'maghrib' | 'isyak';

export interface PrayerItem {
  key: PrayerKey;
  label: string;
  arabicLabel: string;
  time: string; // HH:mm format
  adjustedTime: string; // HH:mm after offset
  offsetMinutes: number;
  iqamahMinutes: number;
  isNext: boolean;
  isCurrent: boolean;
}

export type ScheduleSourceType = 'jakim' | 'manual' | 'sample';

export interface JakimZoneInfo {
  code: string;
  state: string;
  description: string;
}

export interface MosqueConfig {
  mosqueName: string;
  subtitle: string;
  timezone: string;
  selectedZone: string;
  selectedZoneName: string;
  sourceType: ScheduleSourceType;
  isSampleData: boolean; // True until official source verified
  sampleDataNotice: string;
  announcementText: string;
  theme: 'emerald' | 'teal' | 'dark';
  enableIqamahCountdown: boolean;
  enableAudioBeep: boolean;
  showSyuruk: boolean;
  showImsak: boolean;
  showSeconds: boolean;
  iqamahDurations: Record<PrayerKey, number>;
  minuteCorrections: Record<PrayerKey, number>;
  pinCode: string; // Optional security PIN for Mosque Admin (default: "1234")
  isPinEnabled: boolean;
  hijriDayOffset: number; // Koreksi hari penanggalan Hijriyah (+/- hari rukyat hilal)
  customHijriMonth?: string;
  customHijriDay?: number;
  customHijriYear?: number;
  manualSchedule?: Partial<Record<PrayerKey, string>>;
}

export interface PrayerStatus {
  currentPrayer: PrayerItem | null;
  nextPrayer: PrayerItem;
  countdownSeconds: number;
  countdownFormatted: string;
  isTomorrowSubuh: boolean;
  isIqamahActive: boolean;
  iqamahRemainingSeconds: number;
  iqamahFormatted: string;
}

export interface CachedSchedulePayload {
  dateStr: string; // YYYY-MM-DD
  prayers: Record<PrayerKey, string>;
  source: ScheduleSourceType;
  zone: string;
  savedAt: string;
  isSample: boolean;
}
