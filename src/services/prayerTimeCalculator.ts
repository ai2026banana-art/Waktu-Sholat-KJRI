export type FardhuPrayerKey = 'subuh' | 'zohor' | 'asar' | 'maghrib' | 'isyak';

export interface PrayerScheduleState {
  subuh: string;
  zohor: string;
  asar: string;
  maghrib: string;
  isyak: string;
  imsak?: string;
  syuruk?: string;
}

export interface PrayerSlotInfo {
  key: FardhuPrayerKey;
  name: string;
  arabicName: string;
  time: string;
  isNext: boolean;
  isTomorrow: boolean;
  stepIndex: number; // 0 = terdekat (baris atas), 1,2 = baris tengah, 3,4 = baris bawah
}

export interface DynamicPrayerCalculation {
  currentPrayerKey: FardhuPrayerKey | null;
  nextPrayerKey: FardhuPrayerKey;
  nextPrayerName: string;
  nextPrayerTime: string;
  isTomorrow: boolean;
  countdownSeconds: number;
  countdownFormatted: string; // HH:MM:SS
  orderedPrayers: PrayerSlotInfo[]; // 5 items starting with next prayer
}

export const FARDHU_PRAYERS_DEF: {
  key: FardhuPrayerKey;
  name: string;
  arabicName: string;
}[] = [
  { key: 'subuh', name: 'SUBUH', arabicName: 'الفجر' },
  { key: 'zohor', name: 'ZOHOR', arabicName: 'الظهر' },
  { key: 'asar', name: 'ASAR', arabicName: 'العصر' },
  { key: 'maghrib', name: 'MAGHRIB', arabicName: 'المغرب' },
  { key: 'isyak', name: 'ISYAK', arabicName: 'العشاء' },
];

/**
 * Converts "HH:mm" to total seconds of the day (0 - 86399)
 */
export function timeStringToSeconds(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [h, m] = timeStr.split(':').map((v) => parseInt(v, 10));
  return (h || 0) * 3600 + (m || 0) * 60;
}

/**
 * Calculates dynamically:
 * 1. Which prayer is currently the nearest upcoming prayer.
 * 2. Countdown formatted in HH:MM:SS to that upcoming prayer.
 * 3. Subsequent prayers arranged sequentially in cyclical order:
 *    - Box 1 (Top): Nearest upcoming prayer (e.g. Maghrib at 16:23)
 *    - Box 2 & 3 (Middle): Subsequent prayers (e.g. Isyak, Subuh)
 *    - Box 4 & 5 (Bottom): Subsequent prayers (e.g. Zohor, Asar)
 */
export function calculateDynamicPrayers(
  schedule: PrayerScheduleState,
  currentTime: Date
): DynamicPrayerCalculation {
  const currentSeconds =
    currentTime.getHours() * 3600 +
    currentTime.getMinutes() * 60 +
    currentTime.getSeconds();

  let nextIndex = -1;
  let countdownSecs = 0;
  let isTomorrow = false;

  // Check each of the 5 prayers today
  for (let i = 0; i < FARDHU_PRAYERS_DEF.length; i++) {
    const key = FARDHU_PRAYERS_DEF[i].key;
    const prayerTimeStr = schedule[key] || '12:00';
    const prayerSeconds = timeStringToSeconds(prayerTimeStr);

    // If prayer time is in the future today (strictly greater than current time)
    if (prayerSeconds > currentSeconds) {
      nextIndex = i;
      countdownSecs = prayerSeconds - currentSeconds;
      isTomorrow = false;
      break;
    }
  }

  // If all prayers today have passed (e.g., after Isyak), next prayer is Subuh tomorrow
  if (nextIndex === -1) {
    nextIndex = 0; // Subuh
    isTomorrow = true;
    const subuhTimeStr = schedule.subuh || '05:12';
    const subuhSeconds = timeStringToSeconds(subuhTimeStr);
    const secondsRemainingToday = 86400 - currentSeconds;
    countdownSecs = secondsRemainingToday + subuhSeconds;
  }

  // Format countdown string HH:MM:SS
  const ch = Math.floor(countdownSecs / 3600);
  const cm = Math.floor((countdownSecs % 3600) / 60);
  const cs = countdownSecs % 60;
  const countdownFormatted = `${String(ch).padStart(2, '0')}:${String(cm).padStart(2, '0')}:${String(cs).padStart(2, '0')}`;

  // Build the 5 ordered prayer slots sequentially starting from the nearest upcoming prayer
  const orderedPrayers: PrayerSlotInfo[] = [];
  for (let step = 0; step < 5; step++) {
    const def = FARDHU_PRAYERS_DEF[(nextIndex + step) % 5];
    const key = def.key;
    const isStepTomorrow = isTomorrow || nextIndex + step >= 5;

    orderedPrayers.push({
      key,
      name: def.name,
      arabicName: def.arabicName,
      time: schedule[key] || '00:00',
      isNext: step === 0,
      isTomorrow: isStepTomorrow,
      stepIndex: step,
    });
  }

  const nextDef = FARDHU_PRAYERS_DEF[nextIndex];

  return {
    currentPrayerKey: nextIndex > 0 ? FARDHU_PRAYERS_DEF[nextIndex - 1].key : FARDHU_PRAYERS_DEF[4].key,
    nextPrayerKey: nextDef.key,
    nextPrayerName: nextDef.name,
    nextPrayerTime: schedule[nextDef.key] || '00:00',
    isTomorrow,
    countdownSeconds: countdownSecs,
    countdownFormatted,
    orderedPrayers,
  };
}
