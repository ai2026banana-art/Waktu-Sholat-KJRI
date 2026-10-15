import React, { useState } from 'react';
import { Users, UserCheck, Mic, BookOpen, Edit3, Sparkles, Calendar, Check, RotateCcw } from 'lucide-react';

export interface FridayOfficersData {
  fridayDate: string;
  imam: string;
  khatib: string;
  bilal: string;
  khutbahTheme?: string;
}

export const DEFAULT_FRIDAY_OFFICERS: FridayOfficersData = {
  fridayDate: '16 Oktober 2026',
  imam: 'Ustaz Ahmad',
  khatib: 'Ustaz Muhammad',
  bilal: 'Encik Ali',
  khutbahTheme: 'Hakikat Ukhuwah Islamiyah & Berbagi Keberkahan',
};

interface FridayOfficersCardProps {
  data: FridayOfficersData;
  onEdit: () => void;
}

type TabKey = 'all' | 'imam' | 'khatib' | 'bilal';

export const FridayOfficersCard: React.FC<FridayOfficersCardProps> = ({ data, onEdit }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  return (
    <div className="w-full rounded-2xl panel-glass-light border border-[#e2d5bd] shadow-md p-3 md:p-3.5 flex flex-col justify-between relative group transition-all">
      {/* Header Panel & Tab Switcher */}
      <div className="flex items-center justify-between pb-2 border-b border-[#e5dccb]">
        {/* Judul & Tanggal Jumaat */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#fef8ea] border border-[#ecd59d] flex items-center justify-center text-[#967226] shrink-0">
            <Users className="w-3.5 h-3.5 text-[#c59e4b]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-xs font-black uppercase tracking-wider text-[#8c6b24] font-sans">
                IMAM, KHATIB & BILAL
              </h2>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#e8f3ec] text-[#2c614b] border border-[#cbe1d5]">
                SOLAT JUMAAT
              </span>
            </div>
            <p className="text-[10px] text-[#486d5d] font-semibold flex items-center gap-1 mt-0.5">
              <Calendar className="w-2.5 h-2.5 text-[#c59e4b]" />
              <span>Jumaat ini : <strong className="text-[#1a382b] font-bold">{data.fridayDate}</strong></span>
            </p>
          </div>
        </div>

        {/* Tab Selector & Tombol Edit */}
        <div className="flex items-center gap-1.5">
          {/* Tab Navigation Pill Bar */}
          <div className="flex items-center bg-[#f5f1e8] p-0.5 rounded-lg border border-[#ded5c2] text-[10px] font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-[#8c6b24] font-black shadow-xs border border-[#e8dfcf]'
                  : 'text-[#5c8271] hover:text-[#183628]'
              }`}
              title="Lihat semua petugas secara ringkas dan rapi"
            >
              Semua
            </button>
            <button
              onClick={() => setActiveTab('imam')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'imam'
                  ? 'bg-[#1b4332] text-white font-black shadow-xs'
                  : 'text-[#5c8271] hover:text-[#183628]'
              }`}
              title="Fokus Petugas Imam"
            >
              Imam
            </button>
            <button
              onClick={() => setActiveTab('khatib')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'khatib'
                  ? 'bg-[#8c6b24] text-white font-black shadow-xs'
                  : 'text-[#5c8271] hover:text-[#183628]'
              }`}
              title="Fokus Petugas Khatib"
            >
              Khatib
            </button>
            <button
              onClick={() => setActiveTab('bilal')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'bilal'
                  ? 'bg-[#285e61] text-white font-black shadow-xs'
                  : 'text-[#5c8271] hover:text-[#183628]'
              }`}
              title="Fokus Petugas Bilal"
            >
              Bilal
            </button>
          </div>

          {/* Tombol Ubah Manual */}
          <button
            onClick={onEdit}
            title="Klik untuk mengubah nama Imam, Khatib, Bilal, dan Tanggal Jumaat"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90 hover:bg-white text-[#8c6b24] border border-[#e5cf96] text-[10px] font-bold shadow-xs cursor-pointer hover:border-[#c59e4b] transition-all"
          >
            <Edit3 className="w-3 h-3 text-[#c59e4b]" />
            <span className="hidden sm:inline">Ubah</span>
          </button>
        </div>
      </div>

      {/* Konten Tab */}
      <div className="pt-2">
        {/* TAB ALL: Tampilan 3 Kolom Berdampingan yang Sangat Kemas & Rapi */}
        {activeTab === 'all' && (
          <div className="grid grid-cols-3 gap-2">
            {/* 1. IMAM */}
            <div
              onClick={() => setActiveTab('imam')}
              className="rounded-xl bg-[#f7faf8] hover:bg-white border border-[#d6e5dd] p-2 flex flex-col justify-between transition-all cursor-pointer shadow-xs hover:border-[#1b4332]/50 group/item"
            >
              <div className="flex items-center justify-between pb-1 border-b border-[#e5efe9]">
                <div className="flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-[#1b4332]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1b4332]">
                    IMAM
                  </span>
                </div>
                <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-[#e8f3ec] text-[#204e3b]">
                  Solat
                </span>
              </div>
              <div className="my-1 text-center">
                <span className="block font-black text-xs sm:text-sm text-[#143224] tracking-tight group-hover/item:text-[#1b4332]">
                  {data.imam}
                </span>
                <span className="text-[9px] text-[#557b6a] block font-medium">
                  Pemimpin Solat Jumaat
                </span>
              </div>
            </div>

            {/* 2. KHATIB */}
            <div
              onClick={() => setActiveTab('khatib')}
              className="rounded-xl bg-[#fefbf4] hover:bg-white border border-[#eddcb5] p-2 flex flex-col justify-between transition-all cursor-pointer shadow-xs hover:border-[#8c6b24]/50 group/item"
            >
              <div className="flex items-center justify-between pb-1 border-b border-[#f3e8cf]">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-[#8c6b24]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#8c6b24]">
                    KHATIB
                  </span>
                </div>
                <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-[#fef5df] text-[#8c6b24]">
                  Khutbah
                </span>
              </div>
              <div className="my-1 text-center">
                <span className="block font-black text-xs sm:text-sm text-[#2a220b] tracking-tight group-hover/item:text-[#8c6b24]">
                  {data.khatib}
                </span>
                <span className="text-[9px] text-[#7d6738] block font-medium">
                  Penyampai Khutbah
                </span>
              </div>
            </div>

            {/* 3. BILAL */}
            <div
              onClick={() => setActiveTab('bilal')}
              className="rounded-xl bg-[#f4f9f9] hover:bg-white border border-[#cfe2e3] p-2 flex flex-col justify-between transition-all cursor-pointer shadow-xs hover:border-[#285e61]/50 group/item"
            >
              <div className="flex items-center justify-between pb-1 border-b border-[#d8eaeb]">
                <div className="flex items-center gap-1">
                  <Mic className="w-3 h-3 text-[#285e61]" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#285e61]">
                    BILAL
                  </span>
                </div>
                <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-[#e6f4f5] text-[#285e61]">
                  Adzan
                </span>
              </div>
              <div className="my-1 text-center">
                <span className="block font-black text-xs sm:text-sm text-[#133032] tracking-tight group-hover/item:text-[#285e61]">
                  {data.bilal}
                </span>
                <span className="text-[9px] text-[#4d7577] block font-medium">
                  Muadzin & Muroqqi
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB IMAM: Fokus Detail Imam */}
        {activeTab === 'imam' && (
          <div className="rounded-xl bg-gradient-to-r from-[#f0f7f3] to-[#faf8f4] border border-[#cbe1d5] p-2.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1b4332] text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <UserCheck className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#2e624c] block">
                  Petugas Imam Solat Jumaat
                </span>
                <h3 className="text-sm sm:text-base font-black text-[#143224]">
                  {data.imam}
                </h3>
                <p className="text-[10px] text-[#4f7665]">
                  Memimpin sholat fardhu Jumaat dua rakaat & doa bersama jemaah
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('all')}
              className="text-[10px] text-[#1b4332] font-bold underline px-2 py-1 hover:bg-white rounded-lg cursor-pointer"
            >
              Tutup Fokus
            </button>
          </div>
        )}

        {/* TAB KHATIB: Fokus Detail Khatib & Tema Khutbah */}
        {activeTab === 'khatib' && (
          <div className="rounded-xl bg-gradient-to-r from-[#fdfaf2] to-[#faf8f4] border border-[#ecd59d] p-2.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#8c6b24] text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <BookOpen className="w-5 h-5 text-amber-100" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#8c6b24] block">
                    Petugas Khatib Jumaat
                  </span>
                  {data.khutbahTheme && (
                    <span className="text-[8px] font-semibold px-1.5 py-0.2 rounded bg-[#fef5df] text-[#8c6b24]">
                      Tema Khutbah Siap
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-black text-[#2e230b]">
                  {data.khatib}
                </h3>
                <p className="text-[10px] text-[#735d30] italic line-clamp-1">
                  &ldquo;{data.khutbahTheme || 'Meningkatkan Ketaqwaan & Kesejahteraan Ummah'}&rdquo;
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('all')}
              className="text-[10px] text-[#8c6b24] font-bold underline px-2 py-1 hover:bg-white rounded-lg cursor-pointer"
            >
              Tutup Fokus
            </button>
          </div>
        )}

        {/* TAB BILAL: Fokus Detail Bilal */}
        {activeTab === 'bilal' && (
          <div className="rounded-xl bg-gradient-to-r from-[#eef7f8] to-[#faf8f4] border border-[#cfe2e3] p-2.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#285e61] text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <Mic className="w-5 h-5 text-teal-100" />
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#285e61] block">
                  Petugas Bilal & Muadzin
                </span>
                <h3 className="text-sm sm:text-base font-black text-[#133032]">
                  {data.bilal}
                </h3>
                <p className="text-[10px] text-[#4c7577]">
                  Mengumandangkan Adzan Jumaat, membacakan tarhim & doa muroqqi
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('all')}
              className="text-[10px] text-[#285e61] font-bold underline px-2 py-1 hover:bg-white rounded-lg cursor-pointer"
            >
              Tutup Fokus
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
