import React from 'react';
import { MosqueConfig } from '../types/prayer';
import { AlertTriangle, Clock, Settings, Maximize2, Minimize2, Smartphone, Monitor, Code } from 'lucide-react';

interface HeaderBarProps {
  config: MosqueConfig;
  currentTimeStr: string;
  dayName: string;
  masehiDate: string;
  hijriDate: string;
  isOnline: boolean;
  isFullscreen: boolean;
  isPortrait: boolean;
  onOpenSettings: () => void;
  onOpenCodeExport: () => void;
  onToggleFullscreen: () => void;
  onToggleOrientation: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  config,
  currentTimeStr,
  dayName,
  masehiDate,
  hijriDate,
  isOnline,
  isFullscreen,
  isPortrait,
  onOpenSettings,
  onOpenCodeExport,
  onToggleFullscreen,
  onToggleOrientation,
}) => {
  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-emerald-800/60 shrink-0">
      {/* Zone 1: Identitas Masjid */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <div className="flex items-center gap-3">
          <span className="text-2xl md:text-3xl font-extrabold tracking-wide text-amber-400 drop-shadow-sm uppercase">
            Masjid {config.mosqueName}
          </span>
          <span className="hidden sm:inline text-xs font-semibold px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-700/60">
            {config.selectedZone}
          </span>
        </div>
        <p className="text-sm md:text-base font-medium text-emerald-200/90 mt-0.5">
          {config.subtitle}
        </p>
      </div>

      {/* Banner Peringatan Data Contoh (jika aktif) */}
      {config.isSampleData && (
        <button
          onClick={onOpenSettings}
          title="Klik untuk membuka pengaturan jadwal resmi"
          className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900/90 border border-amber-500/80 text-amber-200 text-xs md:text-sm font-semibold transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <span className="tracking-wide">
            {config.sampleDataNotice}
          </span>
          <span className="text-[11px] underline text-amber-300 group-hover:text-amber-100 ml-1">
            (Atur Jadwal)
          </span>
        </button>
      )}

      {/* Zone 2: Jam Digital & Penanggalan */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center md:items-end text-center md:text-right">
          <div className="flex items-baseline gap-1 text-white font-mono tracking-tight font-black text-4xl md:text-5xl drop-shadow-md">
            <span>{currentTimeStr}</span>
          </div>
          <div className="text-xs md:text-sm font-medium text-emerald-200/90 flex items-center gap-1.5 mt-0.5">
            <span className="font-semibold text-white">{dayName}</span>
            <span>·</span>
            <span>{masehiDate}</span>
            <span>·</span>
            <span className="text-amber-300 font-medium">{hijriDate}</span>
          </div>
        </div>

        {/* Quick Toolbar untuk Layar TV & Pengurus */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-emerald-800/50">
          <button
            onClick={onToggleOrientation}
            title={isPortrait ? 'Ubah ke Tampilan Landscape TV (Mendatar)' : 'Ubah ke Pratinjau Portrait'}
            className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors border border-emerald-700/50 cursor-pointer"
          >
            {isPortrait ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh TV (Fullscreen)'}
            className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors border border-emerald-700/50 cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenCodeExport}
            title="Lihat & Unduh Kode Android Native (Kotlin + Compose)"
            className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-amber-300 hover:text-amber-200 transition-colors border border-emerald-700/50 cursor-pointer flex items-center gap-1 text-xs font-semibold px-2.5"
          >
            <Code className="w-4 h-4" />
            <span className="hidden lg:inline">Kode Android</span>
          </button>

          <button
            onClick={onOpenSettings}
            title="Pengaturan Pengurus Masjid"
            className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors border border-emerald-700/50 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
