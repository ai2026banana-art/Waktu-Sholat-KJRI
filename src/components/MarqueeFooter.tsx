import React from 'react';
import { Volume2, Settings, Megaphone } from 'lucide-react';

interface MarqueeFooterProps {
  announcementText: string;
  sourceLabel: string;
  isSampleData: boolean;
  onOpenSettings: () => void;
}

export const MarqueeFooter: React.FC<MarqueeFooterProps> = ({
  announcementText,
  sourceLabel,
  isSampleData,
  onOpenSettings,
}) => {
  return (
    <footer className="w-full shrink-0 flex items-center justify-between gap-3 pt-3 border-t border-emerald-800/60 text-xs md:text-sm">
      {/* Ticker / Running Text Pengumuman */}
      <div className="flex-1 flex items-center gap-3 overflow-hidden rounded-xl bg-emerald-950/90 border border-emerald-800/80 px-4 py-2.5 shadow-inner">
        <div className="flex items-center gap-1.5 shrink-0 text-amber-400 font-bold uppercase text-xs tracking-wider">
          <Megaphone className="w-4 h-4" />
          <span>Pengumuman:</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="animate-marquee inline-block text-white font-medium">
            {announcementText}
          </div>
        </div>
      </div>

      {/* Info Sumber Data & Tombol Pengurus */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="hidden sm:inline text-[11px] text-emerald-300/70 font-mono">
          {sourceLabel}
        </span>

        <button
          onClick={onOpenSettings}
          title="Pengaturan Pengurus Masjid As Syafir"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700/60 transition-all text-xs font-semibold cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Pengurus</span>
        </button>
      </div>
    </footer>
  );
};
