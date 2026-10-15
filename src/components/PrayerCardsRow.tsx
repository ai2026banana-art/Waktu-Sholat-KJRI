import React from 'react';
import { PrayerItem } from '../types/prayer';

interface PrayerCardsRowProps {
  prayers: PrayerItem[];
  isPortrait?: boolean;
}

export const PrayerCardsRow: React.FC<PrayerCardsRowProps> = ({
  prayers,
  isPortrait = false,
}) => {
  return (
    <div
      className={`w-full gap-3 md:gap-4 ${
        isPortrait
          ? 'grid grid-cols-2 sm:grid-cols-3'
          : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6'
      }`}
    >
      {prayers.map((prayer) => {
        const isNext = prayer.isNext;
        const isCurrent = prayer.isCurrent;

        return (
          <div
            key={prayer.key}
            className={`relative rounded-2xl p-4 md:p-5 flex flex-col justify-between transition-all duration-300 ${
              isNext
                ? 'bg-gradient-to-b from-emerald-800 to-emerald-900 border-2 border-amber-400 shadow-2xl shadow-amber-950/40 ring-2 ring-amber-400/40 transform scale-[1.02]'
                : isCurrent
                ? 'bg-emerald-900/90 border border-emerald-600/70 shadow-lg'
                : 'bg-emerald-950/80 border border-emerald-800/70 shadow-md hover:border-emerald-700/80'
            }`}
          >
            {/* Header: Nama Arab & Latin */}
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`block text-xs font-serif ${
                    isNext ? 'text-amber-300' : 'text-emerald-400/80'
                  }`}
                >
                  {prayer.arabicLabel}
                </span>
                <span
                  className={`block font-extrabold text-base md:text-xl uppercase tracking-wider ${
                    isNext ? 'text-amber-300' : 'text-white'
                  }`}
                >
                  {prayer.label}
                </span>
              </div>

              {isNext && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-emerald-950 shadow-sm animate-pulse">
                  BERIKUTNYA
                </span>
              )}

              {!isNext && isCurrent && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200">
                  SAAT INI
                </span>
              )}
            </div>

            {/* Waktu Sholat Utama - Sangat Besar untuk TV Display */}
            <div className="my-3 md:my-5 text-center">
              <span
                className={`font-mono font-black tracking-tight tabular-nums block ${
                  isNext
                    ? 'text-4xl md:text-5xl text-amber-300 drop-shadow-md'
                    : 'text-3xl md:text-4xl text-white'
                }`}
              >
                {prayer.adjustedTime}
              </span>
            </div>

            {/* Footer Keterangan Koreksi / Waktu Asli */}
            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-emerald-800/50">
              <span className="text-emerald-300/70">
                {prayer.key === 'syuruk' ? 'Terbit Matahari' : 'Waktu Sholat'}
              </span>
              {prayer.offsetMinutes !== 0 ? (
                <span className="font-mono text-amber-300 font-semibold">
                  {prayer.offsetMinutes > 0 ? `+${prayer.offsetMinutes}m` : `${prayer.offsetMinutes}m`}
                </span>
              ) : (
                <span className="text-emerald-500/60 font-mono text-[10px]">Tepat</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
