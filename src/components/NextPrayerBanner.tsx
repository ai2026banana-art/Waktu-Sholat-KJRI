import React from 'react';
import { PrayerStatus } from '../types/prayer';
import { Clock, Hourglass, Volume2 } from 'lucide-react';

interface NextPrayerBannerProps {
  status: PrayerStatus;
  enableAudioBeep: boolean;
  onPlayTestChime: () => void;
}

export const NextPrayerBanner: React.FC<NextPrayerBannerProps> = ({
  status,
  enableAudioBeep,
  onPlayTestChime,
}) => {
  const { nextPrayer, countdownFormatted, isTomorrowSubuh, isIqamahActive, iqamahFormatted, currentPrayer } = status;

  if (isIqamahActive && currentPrayer) {
    return (
      <div className="w-full rounded-2xl bg-gradient-to-r from-amber-900/90 via-amber-800/80 to-amber-900/90 border-2 border-amber-400 p-4 md:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 transition-all">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-14 h-14 rounded-2xl bg-amber-950/90 border border-amber-400/80 flex items-center justify-center shrink-0 shadow-inner">
            <Hourglass className="w-7 h-7 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-amber-200">
                HITUNG MUNDUR IQAMAH
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-xs font-bold border border-amber-400/50">
                {currentPrayer.label.toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white mt-0.5 tracking-wide">
              Luruskan dan Rapatkan Shaf Sholat
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-950/90 border-2 border-amber-400 rounded-xl px-6 py-2.5 shadow-lg">
            <span className="font-mono font-black text-3xl md:text-4xl text-amber-300 tracking-wider">
              {iqamahFormatted}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-emerald-900/70 border-2 border-amber-500/70 p-4 md:p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-sm transition-all">
      {/* Kolom Informasi Waktu Berikutnya */}
      <div className="flex items-center gap-4 text-center md:text-left">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-emerald-950/80 border border-amber-500/50 flex items-center justify-center shrink-0 shadow-inner">
          <Clock className="w-6 h-6 md:w-7 md:h-7 text-amber-400" />
        </div>
        <div>
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-amber-400">
              {isTomorrowSubuh ? 'Waktu Berikutnya (Besok)' : 'Waktu Berikutnya'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-200 font-semibold border border-emerald-700/60">
              {nextPrayer.adjustedTime}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-0.5 tracking-wide flex items-center gap-2">
            <span>{nextPrayer.label}</span>
            <span className="text-sm md:text-base font-normal text-emerald-300/80 font-serif">
              ({nextPrayer.arabicLabel})
            </span>
          </h2>
        </div>
      </div>

      {/* Kolom Hitung Mundur */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center md:items-end">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300/90">
            Hitung Mundur Adzan
          </span>
          <div className="bg-emerald-950/90 border-2 border-amber-400/80 rounded-xl px-5 md:px-7 py-2 md:py-2.5 shadow-lg flex items-center gap-2 mt-1">
            <span className="font-mono font-black text-3xl md:text-4xl text-amber-300 tracking-widest tabular-nums">
              {countdownFormatted}
            </span>
          </div>
        </div>

        {enableAudioBeep && (
          <button
            onClick={onPlayTestChime}
            title="Uji Suara Lonceng/Beep Adzan"
            className="p-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-800 text-amber-400 border border-amber-500/40 transition-colors cursor-pointer"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
