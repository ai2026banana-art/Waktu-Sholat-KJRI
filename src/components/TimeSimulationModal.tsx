import React, { useState } from 'react';
import { X, Clock, Play, RotateCcw, Check, Sparkles, ArrowRight } from 'lucide-react';
import { PrayerScheduleState } from './PrayerHijriAdjustModal';

interface TimeSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulatedTime: string | null;
  onSetSimulatedTime: (timeStr: string | null) => void;
  schedule: PrayerScheduleState;
  currentDisplayTime: string;
}

export const TimeSimulationModal: React.FC<TimeSimulationModalProps> = ({
  isOpen,
  onClose,
  simulatedTime,
  onSetSimulatedTime,
  schedule,
  currentDisplayTime,
}) => {
  const [customInput, setCustomInput] = useState(simulatedTime || '16:23');

  if (!isOpen) return null;

  const presets = [
    {
      time: '16:23',
      label: '16:23 (Sore — Melewati Asar)',
      desc: `Melewati Asar (${schedule.asar}) ➔ Kotak 1 berpindah ke MAGHRIB (${schedule.maghrib})`,
      highlight: true,
    },
    {
      time: '12:40',
      label: '12:40 (Siang — Melewati Zohor)',
      desc: `Melewati Zohor (${schedule.zohor}) ➔ Kotak 1 berpindah ke ASAR (${schedule.asar})`,
      highlight: false,
    },
    {
      time: '18:30',
      label: '18:30 (Petang — Melewati Maghrib)',
      desc: `Melewati Maghrib (${schedule.maghrib}) ➔ Kotak 1 berpindah ke ISYAK (${schedule.isyak})`,
      highlight: false,
    },
    {
      time: '20:30',
      label: '20:30 (Malam — Melewati Isyak)',
      desc: `Melewati Isyak (${schedule.isyak}) ➔ Kotak 1 berpindah ke SUBUH ESOK (${schedule.subuh})`,
      highlight: false,
    },
    {
      time: '04:45',
      label: '04:45 (Subuh Dini Hari)',
      desc: `Sebelum Subuh (${schedule.subuh}) ➔ Kotak 1 menghitung mundur menuju SUBUH`,
      highlight: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#faf8f4] border-2 border-[#d4af37]/70 rounded-3xl w-full max-w-lg p-5 md:p-6 shadow-2xl text-[#183628] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5ded0] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#fef7e6] border border-[#ecd59d] flex items-center justify-center text-[#c59e4b]">
              <Clock className="w-5 h-5 text-[#c59e4b]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg text-[#163527]">
                Uji & Simulasi Jam Sholat TV
              </h3>
              <p className="text-xs text-[#527967]">
                Uji perpindahan otomatis kotak sholat terdekat & hitung mundur
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#eae2d3] flex items-center justify-center text-[#5c8271] hover:text-[#1a382b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Status Jam Saat Ini */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#cfded6] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#628776] block tracking-wider">
                Status Jam di Layar TV:
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono font-black text-2xl text-[#183628]">
                  {currentDisplayTime}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    simulatedTime
                      ? 'bg-[#fef5df] text-[#8c6b24] border border-[#ecd59d]'
                      : 'bg-[#edf7f2] text-[#2c654d] border border-[#b8dcce]'
                  }`}
                >
                  {simulatedTime ? `Mode Uji: ${simulatedTime}` : '🟢 Waktu Nyata (Live)'}
                </span>
              </div>
            </div>

            {simulatedTime && (
              <button
                onClick={() => {
                  onSetSimulatedTime(null);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-[#183628] hover:bg-[#234d3a] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#e5cf96]" />
                <span>Reset ke Waktu Nyata</span>
              </button>
            )}
          </div>

          {/* Tombol Reset ke Waktu Nyata jika live */}
          {!simulatedTime && (
            <button
              onClick={() => {
                onSetSimulatedTime(null);
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#edf7f2] border border-[#b8dcce] text-[#23533e] text-xs font-bold flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-[#2f855a]" />
              <span>Sedang Aktif Mengikuti Waktu Nyata (Live System Clock)</span>
            </button>
          )}

          {/* Pilihan Cepat Uji Jam */}
          <div>
            <label className="block text-xs font-bold text-[#355b4a] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c59e4b]" />
              <span>Pilihan Cepat Skenario Uji:</span>
            </label>
            <div className="space-y-2">
              {presets.map((preset) => {
                const isActive = simulatedTime === preset.time;
                return (
                  <button
                    key={preset.time}
                    onClick={() => {
                      onSetSimulatedTime(preset.time);
                      onClose();
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                      isActive
                        ? 'bg-[#fef7e6] border-[#d4af37] ring-2 ring-[#d4af37]/30 shadow-xs'
                        : preset.highlight
                        ? 'bg-[#fffdf7] hover:bg-[#fef9ed] border-[#e7caa0] shadow-xs'
                        : 'bg-white hover:bg-[#f9f7f2] border-[#e2d8c6]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base text-[#183628]">
                          {preset.time}
                        </span>
                        <span className="text-xs font-bold text-[#624716]">
                          {preset.label}
                        </span>
                        {preset.highlight && (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-[#d4af37] text-white px-1.5 py-0.2 rounded-full">
                            Permintaan Anda
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#4d7363] mt-0.5">
                        {preset.desc}
                      </p>
                    </div>

                    <div className="shrink-0 pl-2 text-[#c59e4b] group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Jam Manual Bebas */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#e2d8c6] shadow-xs">
            <label className="block text-xs font-bold text-[#355b4a] mb-1.5">
              Atau Masukkan Jam Khusus Lainnya:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#faf8f3] border border-[#d2dfd7] font-mono font-black text-lg text-[#183628] w-36 text-center"
              />
              <button
                onClick={() => {
                  if (customInput) {
                    onSetSimulatedTime(customInput);
                    onClose();
                  }
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-[#183628] hover:bg-[#234d3a] text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Play className="w-3.5 h-3.5 text-[#e5cf96]" />
                <span>Terapkan Jam {customInput}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#e5ded0] flex items-center justify-between text-xs text-[#527967] shrink-0">
          <span>* Jam pada mode uji dapat di-reset kapan saja ke jam nyata</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white border border-[#cfded6] hover:bg-[#f6f2e8] text-[#183628] font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
