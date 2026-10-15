import React from 'react';
import { Clock, Sliders, Sparkles, SunMedium, Moon } from 'lucide-react';
import { PrayerScheduleState } from './PrayerHijriAdjustModal';
import { PrayerSlotInfo, FardhuPrayerKey } from '../services/prayerTimeCalculator';

interface PrayerTimeRightGridProps {
  schedule: PrayerScheduleState;
  activePrayerKey?: FardhuPrayerKey;
  countdownStr: string;
  orderedPrayers?: PrayerSlotInfo[];
  isTomorrow?: boolean;
  onOpenAdjustModal?: () => void;
}

export const PrayerTimeRightGrid: React.FC<PrayerTimeRightGridProps> = ({
  schedule,
  activePrayerKey = 'maghrib',
  countdownStr,
  orderedPrayers,
  isTomorrow = false,
  onOpenAdjustModal,
}) => {
  // Jika orderedPrayers dikirimkan dari kalkulator dinamis, gunakan langsung.
  // Jika belum, fallback menyusun urutan siklus 5 waktu sholat.
  const prayers: PrayerSlotInfo[] =
    orderedPrayers && orderedPrayers.length === 5
      ? orderedPrayers
      : (() => {
          const base: { key: FardhuPrayerKey; name: string; arabicName: string; time: string }[] = [
            { key: 'subuh', name: 'SUBUH', arabicName: 'الفجر', time: schedule.subuh },
            { key: 'zohor', name: 'ZOHOR', arabicName: 'الظهر', time: schedule.zohor },
            { key: 'asar', name: 'ASAR', arabicName: 'العصر', time: schedule.asar },
            { key: 'maghrib', name: 'MAGHRIB', arabicName: 'المغرب', time: schedule.maghrib },
            { key: 'isyak', name: 'ISYAK', arabicName: 'العشاء', time: schedule.isyak },
          ];
          const activeIdx = Math.max(
            0,
            base.findIndex((p) => p.key === activePrayerKey)
          );
          return [0, 1, 2, 3, 4].map((step) => {
            const item = base[(activeIdx + step) % 5];
            return {
              key: item.key,
              name: item.name,
              arabicName: item.arabicName,
              time: item.time,
              isNext: step === 0,
              isTomorrow: step > 0 && activeIdx + step >= 5,
              stepIndex: step,
            };
          });
        })();

  // 1. Waktu Sholat 1 di Atas (Waktu Terdekat / Berikutnya dengan Hitung Mundur)
  const topPrayer = prayers[0];

  // 2. Waktu Sholat Baris Tengah (Urutan selanjutnya ke-2 dan ke-3)
  const prayerMiddle = [prayers[1], prayers[2]];

  // 3. Waktu Sholat Baris Bawah (Urutan selanjutnya ke-4 dan ke-5)
  const prayerBottom = [prayers[3], prayers[4]];

  return (
    <div className="w-full rounded-2xl md:rounded-3xl panel-glass-light border border-[#e2d5bd] shadow-md p-3 sm:p-3.5 flex flex-col justify-between gap-2 sm:gap-2.5 relative group">
      {/* Tombol Atur Jadwal di Sudut Kotak */}
      {onOpenAdjustModal && (
        <button
          onClick={onOpenAdjustModal}
          title="Ubah Waktu Sholat & Koreksi Menit"
          className="absolute top-2.5 right-3 opacity-60 group-hover:opacity-100 transition-opacity px-2 py-1 rounded-lg bg-white/80 hover:bg-white text-[#456b5a] hover:text-[#163527] border border-[#d2dfd7] shadow-xs cursor-pointer flex items-center gap-1 text-[10px] font-bold z-20"
        >
          <Sliders className="w-3 h-3 text-[#c59e4b]" />
          <span>Atur Waktu</span>
        </button>
      )}

      {/* 1. Baris Atas: 1 WAKTU SHOLAT TERDEKAT (Otomatis Pindah Setelah Waktu Sholat Terlewati) */}
      <div
        onClick={onOpenAdjustModal}
        className="w-full rounded-xl sm:rounded-2xl panel-glass-accent p-2.5 sm:p-3 flex items-center justify-between border-1.5 border-[#d4af37]/80 shadow-xs cursor-pointer hover:border-[#d4af37] transition-all bg-gradient-to-r from-[#fff9ea]/90 via-[#fef4dc]/80 to-[#fdf0cf]/90"
        title="Waktu Sholat Terdekat — Klik untuk menyesuaikan waktu sholat atau koreksi menit"
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#fef5df] border border-[#ecd59d] flex items-center justify-center text-[#967226] shadow-xs">
            <Clock className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#c59e4b] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#8b671e]">
                {topPrayer.name}
              </span>
              <span className="text-[11px] font-serif text-[#a68233]">
                ({topPrayer.arabicName})
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#d4af37] text-white shadow-xs flex items-center gap-0.5">
                <Sparkles className="w-2 h-2" />
                <span>BERIKUTNYA</span>
              </span>
              {topPrayer.isTomorrow && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#edf5f0] text-[#2c5341] border border-[#cfe2d7]">
                  ESOK
                </span>
              )}
            </div>
            <span className="font-mono font-black text-2xl sm:text-3xl text-[#163527] tracking-tight block">
              {topPrayer.time}
            </span>
          </div>
        </div>

        {/* Hitung Mundur Menuju Waktu Sholat Terdekat */}
        <div className="text-right pl-2">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#7e6022] block">
            Hitung Mundur
          </span>
          <span className="font-mono font-black text-xl sm:text-2xl text-[#8b671e] tracking-wider tabular-nums block drop-shadow-xs">
            {countdownStr}
          </span>
        </div>
      </div>

      {/* 2. Baris Tengah: 2 WAKTU SHOLAT SELANJUTNYA */}
      <div className="grid grid-cols-2 gap-2">
        {prayerMiddle.map((item) => (
          <div
            key={item.key}
            onClick={onOpenAdjustModal}
            className="rounded-xl bg-white/75 hover:bg-white/95 border border-[#dfd6c4] px-2.5 py-1.5 sm:py-2 flex flex-col justify-between shadow-xs transition-colors cursor-pointer group/card"
            title={`Klik untuk mengatur waktu sholat ${item.name}`}
          >
            <div className="flex items-center justify-between pb-0.5 border-b border-[#ece4d4]">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#456b5a] group-hover/card:text-[#183528]">
                  {item.name}
                </span>
                <span className="text-[9px] font-serif text-[#81a193]">
                  {item.arabicName}
                </span>
              </div>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                  item.isTomorrow
                    ? 'bg-[#f4ebe1] text-[#93663b] border border-[#e4d4c3]'
                    : 'text-[#628776]'
                }`}
              >
                {item.isTomorrow ? 'Esok Hari' : 'Hari Ini'}
              </span>
            </div>
            <div className="my-0.5 text-center">
              <span className="font-mono font-black text-xl sm:text-2xl text-[#183528] tracking-tight tabular-nums">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Baris Bawah: 2 WAKTU SHOLAT SELANJUTNYA */}
      <div className="grid grid-cols-2 gap-2">
        {prayerBottom.map((item) => (
          <div
            key={item.key}
            onClick={onOpenAdjustModal}
            className="rounded-xl bg-white/75 hover:bg-white/95 border border-[#dfd6c4] px-2.5 py-1.5 sm:py-2 flex flex-col justify-between shadow-xs transition-colors cursor-pointer group/card"
            title={`Klik untuk mengatur waktu sholat ${item.name}`}
          >
            <div className="flex items-center justify-between pb-0.5 border-b border-[#ece4d4]">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#456b5a] group-hover/card:text-[#183528]">
                  {item.name}
                </span>
                <span className="text-[9px] font-serif text-[#81a193]">
                  {item.arabicName}
                </span>
              </div>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                  item.isTomorrow
                    ? 'bg-[#f4ebe1] text-[#93663b] border border-[#e4d4c3]'
                    : 'text-[#628776]'
                }`}
              >
                {item.isTomorrow ? 'Esok Hari' : 'Hari Ini'}
              </span>
            </div>
            <div className="my-0.5 text-center">
              <span className="font-mono font-black text-xl sm:text-2xl text-[#183528] tracking-tight tabular-nums">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
