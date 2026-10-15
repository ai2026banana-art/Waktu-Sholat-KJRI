import React, { useState } from 'react';
import { MosqueConfig, PrayerKey } from '../types/prayer';
import { JAKIM_SARAWAK_ZONES, TIMEZONE_OPTIONS, SAMPLE_PRAYER_TIMES } from '../data/jakimZones';
import { PRAYER_LABELS, playGentleChime } from '../services/prayerTimeService';
import {
  X,
  Save,
  RotateCcw,
  Sliders,
  Volume2,
  Calendar,
  Building2,
  ShieldCheck,
  Check,
  Play,
  FastForward,
  AlertTriangle,
  Moon,
  Sun,
} from 'lucide-react';

interface AdminSettingsModalProps {
  isOpen: boolean;
  config: MosqueConfig;
  onSave: (newConfig: MosqueConfig) => void;
  onClose: () => void;
  onSimulateOffset: (minutes: number) => void;
  onResetSimulation: () => void;
  isSimulating: boolean;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  isOpen,
  config,
  onSave,
  onClose,
  onSimulateOffset,
  onResetSimulation,
  isSimulating,
}) => {
  const [activeTab, setActiveTab] = useState<'identitas' | 'zona' | 'manual' | 'iqamah' | 'tampilan' | 'uji'>('identitas');
  const [formData, setFormData] = useState<MosqueConfig>({ ...config });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 700);
  };

  const handleMinuteCorrectionChange = (key: PrayerKey, delta: number) => {
    setFormData((prev) => ({
      ...prev,
      minuteCorrections: {
        ...prev.minuteCorrections,
        [key]: (prev.minuteCorrections[key] || 0) + delta,
      },
    }));
  };

  const handleManualTimeChange = (key: PrayerKey, time: string) => {
    setFormData((prev) => ({
      ...prev,
      manualSchedule: {
        ...(prev.manualSchedule || {}),
        [key]: time,
      },
    }));
  };

  const handleIqamahDurationChange = (key: PrayerKey, duration: number) => {
    setFormData((prev) => ({
      ...prev,
      iqamahDurations: {
        ...prev.iqamahDurations,
        [key]: Math.max(1, Math.min(60, duration)),
      },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-150">
      <div className="bg-emerald-950 border-2 border-emerald-700/80 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden text-emerald-100">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-800/80 bg-emerald-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">
                Pengaturan Pengurus Masjid
              </h2>
              <p className="text-xs text-emerald-300">
                Papan Jadwal Sholat Digital Masjid {formData.mosqueName} (KJRI Kuching)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs md:text-sm transition-all shadow-md cursor-pointer"
            >
              {saveSuccess ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
              <span>{saveSuccess ? 'Tersimpan!' : 'Simpan'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center overflow-x-auto border-b border-emerald-800/60 bg-emerald-950/70 px-4 py-1.5 gap-1 shrink-0">
          {[
            { id: 'identitas', label: '1. Identitas Masjid' },
            { id: 'zona', label: '2. Lokasi & Zona JAKIM' },
            { id: 'manual', label: '3. Jadwal & Koreksi' },
            { id: 'iqamah', label: '4. Iqamah' },
            { id: 'tampilan', label: '5. Tema & Tampilan' },
            { id: 'uji', label: '6. Uji Coba Jam' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-800 text-amber-300 border border-emerald-700/60 shadow-sm'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-900/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
          {/* TAB 1: IDENTITAS MASJID */}
          {activeTab === 'identitas' && (
            <div className="space-y-5 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
                  Nama Masjid
                </label>
                <input
                  type="text"
                  value={formData.mosqueName}
                  onChange={(e) => setFormData({ ...formData, mosqueName: e.target.value })}
                  placeholder="Contoh: As Syafir"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700 text-white font-medium text-sm focus:outline-none focus:border-amber-400"
                />
                <p className="text-[11px] text-emerald-400/80 mt-1">
                  Nama masjid yang ditampilkan di bagian atas layar TV.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
                  Keterangan Lokasi / Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Contoh: KJRI Kuching, Sarawak, Malaysia"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700 text-white font-medium text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
                  Teks Pengumuman Masjid (Berjalan / Marquee)
                </label>
                <textarea
                  rows={3}
                  value={formData.announcementText}
                  onChange={(e) => setFormData({ ...formData, announcementText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700 text-white font-medium text-sm focus:outline-none focus:border-amber-400"
                  placeholder="Pesan pengumuman atau himbauan untuk jamaah..."
                />
                <p className="text-[11px] text-emerald-400/80 mt-1">
                  Teks ini berjalan di bagian bawah layar informasi untuk dibaca jamaah.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: LOKASI & ZONA JAKIM */}
          {activeTab === 'zona' && (
            <div className="space-y-5 max-w-2xl">
              <div className="p-4 rounded-xl bg-emerald-900/50 border border-emerald-700/60">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Ketetapan Lokasi Resmi KJRI Kuching</span>
                </div>
                <p className="text-xs text-emerald-200 mt-1 leading-relaxed">
                  Masjid As Syafir berlokasi di Konsulat Jenderal Republik Indonesia (KJRI) Kuching, Sarawak.
                  Berdasarkan pembagian takwim resmi <strong>JAKIM (Jabatan Kemajuan Islam Malaysia)</strong>, wilayah Kuching masuk dalam <strong>Zon 8 Sarawak (SWK08)</strong> bersama Bau, Lundu, dan Sematan.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
                  Pilih Zona Resmi JAKIM Sarawak
                </label>
                <select
                  value={formData.selectedZone}
                  onChange={(e) => {
                    const found = JAKIM_SARAWAK_ZONES.find((z) => z.code === e.target.value);
                    setFormData({
                      ...formData,
                      selectedZone: e.target.value,
                      selectedZoneName: found ? found.description : e.target.value,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700 text-white font-medium text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {JAKIM_SARAWAK_ZONES.map((zone) => (
                    <option key={zone.code} value={zone.code} className="bg-emerald-950 text-white">
                      [{zone.code}] {zone.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
                  Zona Waktu Perangkat (Timezone)
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-900/60 border border-emerald-700 text-white font-medium text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {TIMEZONE_OPTIONS.map((tz) => (
                    <option key={tz.value} value={tz.value} className="bg-emerald-950 text-white">
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Data Contoh vs Terverifikasi */}
              <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-600/70 space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Status Verifikasi Jadwal Waktu Sholat
                    </h4>
                    <p className="text-xs text-amber-200/90 mt-0.5 leading-relaxed">
                      Sesuai petunjuk: Jangan mengarang waktu sholat. Jika jadwal belum diverifikasi dengan takwim resmi masjid, biarkan label &quot;DATA CONTOH&quot; menyala.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isSampleData}
                      onChange={(e) => setFormData({ ...formData, isSampleData: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded border-emerald-700 focus:ring-amber-400"
                    />
                    <span className="text-xs font-semibold text-white">
                      Tampilkan Label &quot;DATA CONTOH — belum untuk penggunaan nyata&quot;
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JADWAL & KOREKSI MENIT */}
          {activeTab === 'manual' && (
            <div className="space-y-6">
              <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-700/50 text-xs text-emerald-200">
                Pengurus dapat mengubah jadwal sholat secara manual jika tidak terhubung internet, serta menambahkan koreksi menit (+/- menit) untuk menyesuaikan dengan ijtihad atau jam lokal masjid.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['subuh', 'syuruk', 'zohor', 'asar', 'maghrib', 'isyak'] as PrayerKey[]).map((key) => {
                  const label = PRAYER_LABELS[key];
                  const currentManualTime = formData.manualSchedule?.[key] || '00:00';
                  const currentOffset = formData.minuteCorrections[key] || 0;

                  return (
                    <div
                      key={key}
                      className="p-4 rounded-xl bg-emerald-900/60 border border-emerald-700/70 flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-amber-300 font-serif block">
                            {label.arabic}
                          </span>
                          <span className="font-bold text-white uppercase text-sm">
                            {label.label}
                          </span>
                        </div>
                        <span className="text-xs text-emerald-400 font-mono">
                          Koreksi: {currentOffset > 0 ? `+${currentOffset}m` : `${currentOffset}m`}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Input Waktu Manual */}
                        <div className="flex-1">
                          <label className="block text-[11px] text-emerald-300 mb-1">
                            Waktu Manual (HH:mm)
                          </label>
                          <input
                            type="time"
                            value={currentManualTime}
                            onChange={(e) => handleManualTimeChange(key, e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        {/* Pengatur Koreksi Menit */}
                        <div>
                          <label className="block text-[11px] text-emerald-300 mb-1 text-center">
                            Koreksi Menit
                          </label>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMinuteCorrectionChange(key, -1)}
                              className="w-7 h-7 rounded bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-mono text-xs font-bold text-amber-300">
                              {currentOffset}
                            </span>
                            <button
                              onClick={() => handleMinuteCorrectionChange(key, +1)}
                              className="w-7 h-7 rounded bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: IQAMAH */}
          {activeTab === 'iqamah' && (
            <div className="space-y-5 max-w-2xl">
              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-900/50 border border-emerald-700/60">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Hitung Mundur Iqamah Otomatis
                  </h4>
                  <p className="text-xs text-emerald-300/90 mt-0.5">
                    Menampilkan jeda waktu antara adzan dan sholat berjamaah agar jamaah dapat bersiap.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.enableIqamahCountdown}
                  onChange={(e) => setFormData({ ...formData, enableIqamahCountdown: e.target.checked })}
                  className="w-5 h-5 text-amber-500 rounded border-emerald-700 focus:ring-amber-400"
                />
              </div>

              {formData.enableIqamahCountdown && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Durasi Hitung Mundur Iqamah (Menit setelah Adzan)
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(['subuh', 'zohor', 'asar', 'maghrib', 'isyak'] as PrayerKey[]).map((key) => {
                      const dur = formData.iqamahDurations[key] || 10;
                      return (
                        <div
                          key={key}
                          className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-700 flex flex-col gap-1.5"
                        >
                          <span className="text-xs font-bold text-white uppercase">
                            {PRAYER_LABELS[key].label}
                          </span>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={1}
                              max={45}
                              value={dur}
                              onChange={(e) => handleIqamahDurationChange(key, parseInt(e.target.value, 10) || 5)}
                              className="w-16 px-2.5 py-1 rounded bg-emerald-950 border border-emerald-700 text-white font-mono text-sm text-center"
                            />
                            <span className="text-xs text-emerald-300">menit</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-900/50 border border-emerald-700/60">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Nada Lonceng/Beep Notifikasi Adzan
                  </h4>
                  <p className="text-xs text-emerald-300/90 mt-0.5">
                    Memutar nada pengingat lembut saat masuk waktu sholat.
                  </p>
                </div>
                <button
                  onClick={() => playGentleChime('adhan')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-amber-300 text-xs font-semibold cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Uji Suara</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: TEMA & TAMPILAN */}
          {activeTab === 'tampilan' && (
            <div className="space-y-5 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  Tema Warna Tampilan TV
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'emerald', label: 'Hijau Emerald (Default)', bg: 'bg-[#032b21] border-emerald-500' },
                    { id: 'teal', label: 'Biru Kehijauan Teal', bg: 'bg-[#04272c] border-cyan-500' },
                    { id: 'dark', label: 'Hitam Elegan', bg: 'bg-[#0b0f12] border-slate-600' },
                  ].map((th) => (
                    <button
                      key={th.id}
                      onClick={() => setFormData({ ...formData, theme: th.id as any })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${th.bg} ${
                        formData.theme === th.id ? 'ring-2 ring-amber-400 text-amber-300 font-bold' : 'text-white'
                      }`}
                    >
                      <span className="text-xs block">{th.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showSyuruk}
                    onChange={(e) => setFormData({ ...formData, showSyuruk: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded border-emerald-700"
                  />
                  <span className="text-xs font-medium text-white">
                    Tampilkan Waktu Syuruk (Terbit Matahari) di Papan Utama
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 6: UJI COBA JAM & HITUNG MUNDUR */}
          {activeTab === 'uji' && (
            <div className="space-y-5 max-w-2xl">
              <div className="p-4 rounded-xl bg-emerald-900/50 border border-emerald-700/60">
                <h4 className="text-sm font-bold text-amber-300 mb-1">
                  Pengujian Jam, Hitung Mundur & Adzan
                </h4>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Gunakan tombol di bawah ini untuk mempercepat waktu sementara waktu guna memastikan hitung mundur, perpindahan waktu setelah Isyak ke Subuh, dan alarm adzan berjalan akurat tanpa harus menunggu jam sebenarnya.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSimulateOffset(15)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                >
                  <FastForward className="w-4 h-4 text-amber-400" />
                  <span>Maju +15 Menit</span>
                </button>

                <button
                  onClick={() => onSimulateOffset(60)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                >
                  <FastForward className="w-4 h-4 text-amber-400" />
                  <span>Maju +1 Jam</span>
                </button>

                <button
                  onClick={() => onSimulateOffset(360)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                >
                  <FastForward className="w-4 h-4 text-amber-400" />
                  <span>Maju +6 Jam</span>
                </button>

                {isSimulating && (
                  <button
                    onClick={onResetSimulation}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-900/80 hover:bg-red-800 text-white text-xs font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Kembalikan ke Waktu Nyata</span>
                  </button>
                )}
              </div>

              <div className="pt-3">
                <button
                  onClick={() => playGentleChime('adhan')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Uji Suara Lonceng / Chime Adzan</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
