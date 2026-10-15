import React, { useState } from 'react';
import { X, Check, Users, UserCheck, BookOpen, Mic, Calendar, RotateCcw, Sparkles } from 'lucide-react';
import { FridayOfficersData, DEFAULT_FRIDAY_OFFICERS } from './FridayOfficersCard';

interface FridayOfficersModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FridayOfficersData;
  onSave: (newData: FridayOfficersData) => void;
}

export const FridayOfficersModal: React.FC<FridayOfficersModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
}) => {
  const [formData, setFormData] = useState<FridayOfficersData>(data);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleReset = () => {
    setFormData(DEFAULT_FRIDAY_OFFICERS);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#faf8f4] border border-[#d4af37]/70 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-[#1a382b] relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5ded0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#fef6e4] border border-[#ecd59d] flex items-center justify-center text-[#8c6b24]">
              <Users className="w-5 h-5 text-[#c59e4b]" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#8c6b24]">
                Ubah Petugas Solat Jumaat
              </h3>
              <p className="text-xs text-[#527a69]">
                Masjid Indonesia As Syafir · KJRI Kuching
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#eae2d3] flex items-center justify-center text-[#5c8271] hover:text-[#1a382b] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Pengisian */}
        <form onSubmit={handleSubmit} className="space-y-3.5 py-4 text-xs">
          {/* Tanggal Jumaat */}
          <div>
            <label className="block text-[#385e4e] font-bold mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#c59e4b]" />
              <span>Tanggal / Jadwal Jumaat:</span>
            </label>
            <input
              type="text"
              value={formData.fridayDate}
              onChange={(e) => setFormData({ ...formData, fridayDate: e.target.value })}
              placeholder="Contoh: 16 Oktober 2026"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#cfded6] focus:border-[#2d6a4f] focus:outline-none text-[#1c382b] font-medium shadow-xs"
              required
            />
          </div>

          {/* Nama Imam */}
          <div>
            <label className="block text-[#385e4e] font-bold mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#1b4332]" />
              <span>Nama Imam:</span>
            </label>
            <input
              type="text"
              value={formData.imam}
              onChange={(e) => setFormData({ ...formData, imam: e.target.value })}
              placeholder="Contoh: Ustaz Ahmad"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#cfded6] focus:border-[#1b4332] focus:outline-none text-[#1c382b] font-bold shadow-xs"
              required
            />
          </div>

          {/* Nama Khatib */}
          <div>
            <label className="block text-[#385e4e] font-bold mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#8c6b24]" />
              <span>Nama Khatib:</span>
            </label>
            <input
              type="text"
              value={formData.khatib}
              onChange={(e) => setFormData({ ...formData, khatib: e.target.value })}
              placeholder="Contoh: Ustaz Muhammad"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#cfded6] focus:border-[#8c6b24] focus:outline-none text-[#1c382b] font-bold shadow-xs"
              required
            />
          </div>

          {/* Nama Bilal */}
          <div>
            <label className="block text-[#385e4e] font-bold mb-1 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-[#285e61]" />
              <span>Nama Bilal:</span>
            </label>
            <input
              type="text"
              value={formData.bilal}
              onChange={(e) => setFormData({ ...formData, bilal: e.target.value })}
              placeholder="Contoh: Encik Ali"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#cfded6] focus:border-[#285e61] focus:outline-none text-[#1c382b] font-bold shadow-xs"
              required
            />
          </div>

          {/* Judul Tema Khutbah (Opsional) */}
          <div>
            <label className="block text-[#385e4e] font-bold mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c59e4b]" />
              <span>Judul / Tema Khutbah (Opsional):</span>
            </label>
            <input
              type="text"
              value={formData.khutbahTheme || ''}
              onChange={(e) => setFormData({ ...formData, khutbahTheme: e.target.value })}
              placeholder="Contoh: Menjaga Silaturahmi di Tanah Rantau"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#cfded6] focus:border-[#8c6b24] focus:outline-none text-[#1c382b] text-xs shadow-xs"
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-between pt-4 border-t border-[#e5ded0]">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-[11px] text-[#718f81] hover:text-[#1a382b] font-bold cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kembalikan Default</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#d2dfd7] bg-white text-[#4a7261] hover:bg-[#eae2d3] font-bold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
              >
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Simpan Petugas</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
