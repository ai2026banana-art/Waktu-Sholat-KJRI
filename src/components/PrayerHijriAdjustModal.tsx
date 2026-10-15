import React, { useState } from 'react';
import { X, Moon, Clock, Sparkles, RefreshCw, Check, AlertCircle, Sun, Calendar } from 'lucide-react';

export interface PrayerScheduleState {
  subuh: string;
  zohor: string;
  asar: string;
  maghrib: string;
  isyak: string;
  imsak?: string;
  syuruk?: string;
}

export interface HijriDateState {
  day: number;
  monthName: string;
  year: number;
  dayOffset: number; // -2, -1, 0, +1, +2
  customTextOverride?: string;
  gregorianDateText: string;
}

interface PrayerHijriAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: PrayerScheduleState;
  onSaveSchedule: (newSchedule: PrayerScheduleState) => void;
  hijriDate: HijriDateState;
  onSaveHijriDate: (newHijri: HijriDateState) => void;
  activePrayerKey: 'subuh' | 'zohor' | 'asar' | 'maghrib' | 'isyak';
  onSetActivePrayerKey: (key: 'subuh' | 'zohor' | 'asar' | 'maghrib' | 'isyak') => void;
  isAutoShift?: boolean;
  onSetAutoShift?: (auto: boolean) => void;
}

const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  'Rabiul Awal',
  'Rabiul Akhir',
  'Jumadil Ula',
  'Jumadil Akhir',
  'Rajab',
  'Sya’ban',
  'Ramadhan',
  'Syawal',
  'Dzulqa’dah',
  'Dzulhijjah',
];

export const PrayerHijriAdjustModal: React.FC<PrayerHijriAdjustModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onSaveSchedule,
  hijriDate,
  onSaveHijriDate,
  activePrayerKey,
  onSetActivePrayerKey,
  isAutoShift = true,
  onSetAutoShift,
}) => {
  const [activeTab, setActiveTab] = useState<'waktu' | 'hijriah'>('waktu');

  // Local state for Schedule
  const [localSchedule, setLocalSchedule] = useState<PrayerScheduleState>(schedule);
  const [localActivePrayer, setLocalActivePrayer] = useState(activePrayerKey);
  const [localAutoShift, setLocalAutoShift] = useState(isAutoShift);

  // Local state for Hijri Date
  const [localHijri, setLocalHijri] = useState<HijriDateState>(hijriDate);

  if (!isOpen) return null;

  // Helper adjust time by minutes
  const adjustMinute = (prayerKey: keyof PrayerScheduleState, deltaMinutes: number) => {
    const curVal = localSchedule[prayerKey] || '12:00';
    const [h, m] = curVal.split(':').map(Number);
    let totalMinutes = h * 60 + m + deltaMinutes;
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    totalMinutes = totalMinutes % (24 * 60);

    const newH = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const newM = String(totalMinutes % 60).padStart(2, '0');
    setLocalSchedule((prev) => ({
      ...prev,
      [prayerKey]: `${newH}:${newM}`,
    }));
  };

  // Helper adjust Hijri Day
  const handleOffsetChange = (offset: number) => {
    const baseDay = hijriDate.day - hijriDate.dayOffset;
    let newDay = baseDay + offset;
    if (newDay < 1) newDay = 1;
    if (newDay > 30) newDay = 30;

    setLocalHijri((prev) => ({
      ...prev,
      dayOffset: offset,
      day: newDay,
    }));
  };

  const handleSaveAll = () => {
    onSaveSchedule(localSchedule);
    onSaveHijriDate(localHijri);
    onSetActivePrayerKey(localActivePrayer);
    if (onSetAutoShift) {
      onSetAutoShift(localAutoShift);
    }
    onClose();
  };

  const handleResetDefault = () => {
    const defaultSchedule: PrayerScheduleState = {
      subuh: '05:12',
      zohor: '12:34',
      asar: '15:45',
      maghrib: '18:21',
      isyak: '19:32',
      imsak: '05:02',
      syuruk: '06:28',
    };
    const defaultHijri: HijriDateState = {
      day: 4,
      monthName: 'Rabiul Akhir',
      year: 1448,
      dayOffset: 0,
      gregorianDateText: 'Khamis, 15 Oktober 2026',
    };
    setLocalSchedule(defaultSchedule);
    setLocalHijri(defaultHijri);
    setLocalActivePrayer('asar');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#faf8f3] border-2 border-[#d4af37]/70 rounded-3xl w-full max-w-2xl p-6 shadow-2xl text-[#1a382b] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5dccb] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#fef8ea] border border-[#ecd59d] flex items-center justify-center text-[#c59e4b] shadow-xs">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg text-[#163527] font-sans">
                Pengaturan Waktu Sholat & Hilal Bulan Islam
              </h3>
              <p className="text-xs text-[#587c6c]">
                Masjid Indonesia As Syafir · KJRI Kuching, Sarawak
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

        {/* Tab Selection */}
        <div className="flex items-center gap-2 pt-4 pb-2 shrink-0 border-b border-[#ece4d4]">
          <button
            onClick={() => setActiveTab('hijriah')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'hijriah'
                ? 'bg-[#1a382b] text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-[#456b5a] border border-[#d6e3dc]'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-[#e5cf96]" />
            <span>Tanggal Bulan Islam (Hilal Rukyatul)</span>
          </button>

          <button
            onClick={() => setActiveTab('waktu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'waktu'
                ? 'bg-[#1a382b] text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-[#456b5a] border border-[#d6e3dc]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#e5cf96]" />
            <span>Penyesuaian Waktu Sholat</span>
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* ============================================================== */}
          {/* TAB 1: KALENDER HIJRIAH & PERGESERAN HILAL (BULAN TERBIT/TENGGELAM) */}
          {/* ============================================================== */}
          {activeTab === 'hijriah' && (
            <div className="space-y-4">
              {/* Box Keterangan Hilal */}
              <div className="rounded-2xl bg-[#edf5f0] border border-[#b8dcce] p-3.5 text-xs text-[#204535] leading-relaxed flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-[#3b7e61] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#173a2b] font-bold mb-0.5">
                    Penyesuaian Rukyatul Hilal (Terbit & Tenggelam Bulan Sabit):
                  </strong>
                  Karena penentuan 1 bulan Hijriah bergantung pada terbit dan tenggelamnya bulan (rukyatul hilal) setempat di Sarawak/Malaysia, tanggal Hijriah dapat bergeser 1 atau 2 hari dibandingkan kalender hisab astronomi. Gunakan tombol koreksi di bawah ini untuk menyelaraskan dengan ketetapan resmi KJRI / JAKIM Sarawak.
                </div>
              </div>

              {/* Tombol Cepat Pergeseran Hari Hilal */}
              <div>
                <label className="block text-xs font-bold text-[#355b4a] mb-2">
                  Koreksi Hari Hilal (Pergeseran Tanggal):
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[-2, -1, 0, 1, 2].map((offset) => {
                    const isSelected = localHijri.dayOffset === offset;
                    const label =
                      offset === 0
                        ? '0 (Standar)'
                        : offset > 0
                        ? `+${offset} Hari`
                        : `${offset} Hari`;
                    return (
                      <button
                        key={offset}
                        onClick={() => handleOffsetChange(offset)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#d4af37] text-white border-[#b8942b] shadow-xs ring-2 ring-[#d4af37]/30'
                            : 'bg-white hover:bg-[#f6f2e8] text-[#345847] border-[#d8d3c5]'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Input Detail Tanggal Hijriah */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-[#e2d8c6] shadow-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#456b5a] mb-1">
                    Tanggal Hijriah (Hari)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={localHijri.day}
                    onChange={(e) =>
                      setLocalHijri({ ...localHijri, day: Math.min(30, Math.max(1, Number(e.target.value) || 1)) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f3] border border-[#d2dfd7] font-mono font-bold text-[#183628] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#456b5a] mb-1">
                    Bulan Hijriah
                  </label>
                  <select
                    value={localHijri.monthName}
                    onChange={(e) =>
                      setLocalHijri({ ...localHijri, monthName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f3] border border-[#d2dfd7] font-bold text-[#183628] text-sm"
                  >
                    {HIJRI_MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#456b5a] mb-1">
                    Tahun Hijriah
                  </label>
                  <input
                    type="number"
                    value={localHijri.year}
                    onChange={(e) =>
                      setLocalHijri({ ...localHijri, year: Number(e.target.value) || 1448 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f3] border border-[#d2dfd7] font-mono font-bold text-[#183628] text-sm"
                  />
                </div>
              </div>

              {/* Tanggal Masehi */}
              <div className="bg-white p-4 rounded-2xl border border-[#e2d8c6] shadow-xs">
                <label className="block text-[11px] font-bold text-[#456b5a] mb-1">
                  Hari & Tanggal Masehi yang Ditampilkan di Header TV:
                </label>
                <input
                  type="text"
                  value={localHijri.gregorianDateText}
                  onChange={(e) =>
                    setLocalHijri({ ...localHijri, gregorianDateText: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#faf8f3] border border-[#d2dfd7] font-bold text-[#183628] text-sm"
                  placeholder="Khamis, 15 Oktober 2026"
                />
              </div>

              {/* Preview Hasil Tampilan */}
              <div className="p-3.5 rounded-2xl bg-[#fef9ee] border border-[#ecd59d] flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider font-extrabold text-[#8c6b24]">
                    Pratinjau Tanggal di TV Display:
                  </span>
                  <div className="font-bold text-[#183628] text-sm sm:text-base">
                    {localHijri.gregorianDateText}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#8c6b24] px-3 py-1 rounded-full bg-white border border-[#ecd59d] shadow-xs">
                    {localHijri.day} {localHijri.monthName} {localHijri.year} H
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: PENYESUAIAN WAKTU SHOLAT MANUAL & PILIHAN WAKTU BERIKUTNYA */}
          {/* ============================================================== */}
          {activeTab === 'waktu' && (
            <div className="space-y-4">
              {/* Card Penjelasan Perpindahan Otomatis */}
              <div className="rounded-2xl bg-[#edf5f0] border border-[#b8dcce] p-3.5 text-xs text-[#204535] leading-relaxed flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-[#3b7e61] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#173a2b] font-bold mb-0.5">
                    Perpindahan Otomatis Waktu Sholat Terdekat:
                  </strong>
                  Ketika jam melewati waktu sholat yang sedang aktif (misalnya telah lewat jam 15:45 Asar, maka pada jam 16:23 otomatis berpindah ke Maghrib), kotak baris atas akan langsung berpindah ke waktu sholat terdekat berikutnya lengkap dengan hitung mundur adzan.
                </div>
              </div>

              {/* Toggle Mode Otomatis vs Pilihan Manual */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#e2d8c6] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="block text-xs font-bold text-[#355b4a]">
                      Mode Perpindahan Kotak Atas:
                    </label>
                    <span className="text-[11px] text-[#638776]">
                      {localAutoShift
                        ? '🟢 Otomatis berpindah ke waktu sholat terdekat berdasarkan jam'
                        : '🟡 Manual (Dikunci pada sholat yang dipilih)'}
                    </span>
                  </div>

                  <button
                    onClick={() => setLocalAutoShift(!localAutoShift)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      localAutoShift
                        ? 'bg-[#183628] text-white border-[#183628] shadow-xs'
                        : 'bg-white text-[#456b5a] border-[#cfded6] hover:bg-[#f6f2e8]'
                    }`}
                  >
                    <span>{localAutoShift ? 'Otomatis: AKTIF' : 'Otomatis: MATI'}</span>
                  </button>
                </div>

                {!localAutoShift && (
                  <div className="mt-3 pt-3 border-t border-[#ece4d4]">
                    <span className="block text-[11px] font-bold text-[#8c6b24] mb-1.5">
                      Pilih Waktu Sholat Tertentu untuk Dikunci di Kotak Atas:
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      {(['subuh', 'zohor', 'asar', 'maghrib', 'isyak'] as const).map((key) => {
                        const isSelected = localActivePrayer === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setLocalActivePrayer(key)}
                            className={`py-2 px-1 rounded-xl text-xs font-bold text-center border uppercase transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#d4af37] text-white border-[#b8942b] shadow-xs ring-2 ring-[#d4af37]/30'
                                : 'bg-white hover:bg-[#f6f2e8] text-[#345847] border-[#d8d3c5]'
                            }`}
                          >
                            {key}
                            {isSelected && ' ★'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Daftar 5 Waktu Sholat */}
              <div className="space-y-2.5">
                {(
                  [
                    { key: 'subuh', label: 'SUBUH', def: '05:12' },
                    { key: 'zohor', label: 'ZOHOR', def: '12:34' },
                    { key: 'asar', label: 'ASAR', def: '15:45' },
                    { key: 'maghrib', label: 'MAGHRIB', def: '18:21' },
                    { key: 'isyak', label: 'ISYAK', def: '19:32' },
                  ] as const
                ).map(({ key, label }) => {
                  const val = localSchedule[key];
                  const isHighlighted = localActivePrayer === key;

                  return (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                        isHighlighted
                          ? 'bg-[#fef9ee] border-[#d4af37] shadow-xs'
                          : 'bg-white border-[#e0d7c7]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isHighlighted
                              ? 'bg-[#d4af37] text-white'
                              : 'bg-[#edf5f0] text-[#355b4a]'
                          }`}
                        >
                          {label.substring(0, 1)}
                        </div>
                        <div>
                          <span className="font-extrabold text-sm text-[#183628] block">
                            {label}
                          </span>
                          {isHighlighted && (
                            <span className="text-[10px] font-bold text-[#8c6b24]">
                              ★ Ditampilkan di Kotak Atas
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Tombol -1m */}
                        <button
                          onClick={() => adjustMinute(key, -1)}
                          className="w-8 h-8 rounded-lg bg-[#f4eee2] hover:bg-[#ebdcc0] text-[#695221] font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                          title="Kurangi 1 Menit"
                        >
                          -1m
                        </button>

                        {/* Input Jam:Menit Langsung */}
                        <input
                          type="time"
                          value={val}
                          onChange={(e) =>
                            setLocalSchedule({
                              ...localSchedule,
                              [key]: e.target.value,
                            })
                          }
                          className="px-2.5 py-1 rounded-xl bg-[#faf8f3] border border-[#d2dfd7] font-mono font-black text-[#183628] text-base w-28 text-center"
                        />

                        {/* Tombol +1m */}
                        <button
                          onClick={() => adjustMinute(key, 1)}
                          className="w-8 h-8 rounded-lg bg-[#f4eee2] hover:bg-[#ebdcc0] text-[#695221] font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                          title="Tambah 1 Menit"
                        >
                          +1m
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#e5dccb] shrink-0">
          <button
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#5c8271] hover:text-[#1a382b] hover:bg-[#eae2d3] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Standar Kuching Zon 8</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#456b5a] hover:bg-[#eae2d3] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#1a382b] hover:bg-[#12281e] text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
            >
              <Check className="w-4 h-4 text-[#e5cf96]" />
              <span>Simpan & Terapkan di Layar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
