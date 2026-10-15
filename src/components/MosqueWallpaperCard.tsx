import React, { useState, useRef } from 'react';
import { QuranVerse } from '../data/quranVerses';
import { UploadedMosquePhoto } from '../services/photoStorage';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Eye,
  Upload,
  Image as ImageIcon,
  FolderOpen,
  CheckCircle2,
} from 'lucide-react';

interface MosqueWallpaperCardProps {
  verse: QuranVerse;
  verseIndex: number;
  totalVerses: number;
  rotationTimeStr: string;
  isFading: boolean;
  onPrev: () => void;
  onNext: () => void;
  photos: UploadedMosquePhoto[];
  activePhoto: UploadedMosquePhoto | null;
  onSelectPhotoId: (id: string) => void;
  onOpenPhotoModal: () => void;
  onQuickUpload: (files: FileList) => void;
}

export const MosqueWallpaperCard: React.FC<MosqueWallpaperCardProps> = ({
  verse,
  verseIndex,
  totalVerses,
  rotationTimeStr,
  isFading,
  onPrev,
  onNext,
  photos,
  activePhoto,
  onSelectPhotoId,
  onOpenPhotoModal,
  onQuickUpload,
}) => {
  // Kadar Transparansi Overlay (Default 35%, dalam rentang 30% - 50%)
  const [overlayOpacity, setOverlayOpacity] = useState<number>(35);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onQuickUpload(e.target.files);
    }
  };

  const activeIndex = photos.findIndex((p) => p.id === activePhoto?.id);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden panel-glass-light border border-[#e2d5bd] shadow-lg flex flex-col justify-between p-6 md:p-7 transition-all group">
      {/* Hidden File Input untuk penambahan foto kilat */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {/* ============================================================== */}
      {/* 1. LATAR BELAKANG: FOTO MASJID YANG DIUNGGAH OLEH PENGGUNA     */}
      {/* ============================================================== */}
      <div className="absolute inset-0 z-0 bg-[#e7eee9] overflow-hidden">
        {activePhoto ? (
          <img
            src={activePhoto.dataUrl}
            alt={activePhoto.name}
            className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-1000 scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#e8f1eb] to-[#f4ede2]">
            <ImageIcon className="w-16 h-16 text-[#8bb49f] mb-3 animate-pulse" />
            <h4 className="text-base font-bold text-[#1a382b]">Belum Ada Foto Masjid Diunggah</h4>
            <p className="text-xs text-[#527766] max-w-sm mt-1 mb-4">
              Silakan unggah foto masjid Anda untuk dijadikan latar belakang ayat Al-Qur'an.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-[#2b5945] text-white text-xs font-bold hover:bg-[#1f4233] transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Upload className="w-4 h-4 text-[#fed774]" />
              <span>Unggah Foto Masjid Sekarang</span>
            </button>
          </div>
        )}

        {/* Lapisan Overlay Putih-Krem dengan Transparansi Terkontrol (30% - 50%) */}
        {/* Mengacu pada permintaan pengguna: transparansi diatur ke 30-50% agar foto masjid terlihat jelas */}
        <div
          className="absolute inset-0 bg-[#f9f7f2] pointer-events-none transition-opacity duration-300"
          style={{ opacity: overlayOpacity / 100 }}
        />

        {/* Gradien Vignette Lembut di Pinggiran Panel */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-white/40 pointer-events-none" />
      </div>

      {/* ============================================================== */}
      {/* 2. HEADER KOTAK: NAVIGASI AYAT, PENGELOLA FOTO & KONTROL WAKTU */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full flex items-center justify-between gap-2">
        {/* Kiri: Label Ayat Suci & Tombol Kelola Foto */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#c2d7cc] shadow-xs text-xs font-bold text-[#1f4735]">
            <Sparkles className="w-3.5 h-3.5 text-[#c59e4b]" />
            <span>Ayat Al-Qur'an Pilihan</span>
          </div>

          {/* Tombol Kelola Foto Unggahan */}
          <button
            onClick={onOpenPhotoModal}
            className="flex items-center gap-1.5 bg-[#f5fbf7]/90 hover:bg-white px-2.5 py-1 rounded-full border border-[#bed2c7] text-[11px] font-bold text-[#2d5945] cursor-pointer shadow-xs transition-all hover:scale-105"
            title="Buka galeri foto masjid, pilih wallpaper, atau unggah foto baru"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#c59e4b]" />
            <span>Foto Masjid ({photos.length})</span>
          </button>
        </div>

        {/* Kanan: Unggah Cepat, Transparansi, Hitung Mundur 4 Menit, & Navigasi */}
        <div className="flex items-center gap-2">
          {/* Tombol Unggah Cepat */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="hidden sm:flex items-center gap-1 bg-[#f7f5ed]/90 hover:bg-white px-2 py-1 rounded-lg border border-[#e0d6c4] text-[11px] font-bold text-[#456b5a] cursor-pointer shadow-xs transition-colors"
            title="Unggah foto masjid baru dari komputer/HP"
          >
            <Upload className="w-3 h-3 text-[#c59e4b]" />
            <span>+ Unggah</span>
          </button>

          {/* Tombol Cepat Kadar Transparansi Wallpaper (30% - 50%) */}
          <div className="hidden md:flex items-center gap-1 bg-[#f7f5ed]/90 px-1.5 py-0.5 rounded-lg border border-[#e0d6c4] text-[10px] font-bold text-[#5c8271]">
            <Eye className="w-3 h-3 text-[#c59e4b]" />
            <span className="mr-0.5">Transparansi:</span>
            {[30, 40, 50].map((pct) => (
              <button
                key={pct}
                onClick={() => setOverlayOpacity(pct)}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                  overlayOpacity === pct
                    ? 'bg-[#d4af37] text-white font-black'
                    : 'hover:bg-white text-[#456b5a]'
                }`}
                title={`Ubah transparansi overlay foto ke ${pct}%`}
              >
                {pct}%
              </button>
            ))}
          </div>

          {/* Indikator Waktu Hitung Mundur 4 Menit */}
          <div
            className="flex items-center gap-1.5 text-[11px] font-mono text-[#365f4d] bg-[#edf5f0]/95 px-2.5 py-1 rounded-full border border-[#c8ded3] shadow-xs"
            title="Berganti otomatis setiap 4 menit"
          >
            <RotateCw className="w-3 h-3 text-[#c59e4b] animate-spin" style={{ animationDuration: '16s' }} />
            <span>{rotationTimeStr}</span>
          </div>

          {/* Tombol Geser Ayat Manual */}
          <div className="flex items-center gap-1 bg-[#f7f5ed]/90 px-1 py-0.5 rounded-lg border border-[#e0d6c4]">
            <button
              onClick={onPrev}
              title="Ayat Sebelumnya"
              className="p-1 rounded hover:bg-white text-[#365f4d] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-[#8c6b24] font-mono px-1">
              {verseIndex + 1}/{totalVerses}
            </span>
            <button
              onClick={onNext}
              title="Ayat Berikutnya"
              className="p-1 rounded hover:bg-white text-[#365f4d] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Badge Nama Surah */}
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#fef8ea] text-[#8c6b24] border border-[#ebd6a2] shadow-xs">
            {verse.surah}
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. BADAN TENGAH: TULISAN ARAB INDAH & TERJEMAHAN               */}
      {/* ============================================================== */}
      <div
        className={`relative z-10 flex-1 flex flex-col justify-center my-3 transition-opacity duration-300 ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="bg-white/70 backdrop-blur-[5px] border border-white/85 rounded-2xl p-5 md:p-6 shadow-sm">
          {/* Tulisan Arab Kaligrafi Besar & Terang */}
          <div className="w-full text-right" dir="rtl">
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-4xl leading-[1.8] text-[#102a1e] font-normal tracking-wide drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
              {verse.arabic}
            </p>
          </div>

          {/* Ornamen Garis Emas Pucat */}
          <div className="flex items-center justify-center my-3 opacity-60">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#c59e4b] to-transparent" />
            <span className="mx-2 text-[#c59e4b] text-xs">✦</span>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#c59e4b] to-transparent" />
          </div>

          {/* Terjemahan Bahasa Indonesia / Melayu */}
          <div className="w-full text-left">
            <p className="text-sm sm:text-base md:text-[17px] text-[#1c3c2e] font-medium leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
              {verse.translation}
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. FOOTER KOTAK: IDENTITAS FOTO MASJID UNGGAHAN & PEMILIH FOTO */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full pt-2.5 border-t border-[#e5dccb]/90 bg-white/60 backdrop-blur-[6px] px-3.5 py-1.5 rounded-2xl flex items-center justify-between text-xs text-[#527d6a] shadow-xs">
        {/* Kiri: Nama Foto Aktif & Status Penyimpanan */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#e3efe8] flex items-center justify-center text-[#234d3a]">
            <ImageIcon className="w-3 h-3 text-[#c59e4b]" />
          </div>
          <div className="flex items-center gap-1.5 truncate max-w-[280px] sm:max-w-md">
            <span className="font-bold text-[#1a382b] truncate">
              {activePhoto ? activePhoto.name : 'Foto Masjid'}
            </span>
            <span className="text-[#648b7a] text-[11px] shrink-0">
              · {photos.length > 0 && activeIndex >= 0 ? `Foto ${activeIndex + 1} dari ${photos.length}` : 'Tersimpan'}
            </span>
          </div>
        </div>

        {/* Kanan: Pemilih Cepat Foto Unggahan (1, 2, 3...) & Tombol Kelola */}
        <div className="flex items-center gap-1.5">
          {photos.length > 1 && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-[#8c6b24] hidden sm:inline mr-0.5">
                Pilih Foto:
              </span>
              {photos.slice(0, 7).map((p, idx) => {
                const isSelected = p.id === activePhoto?.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPhotoId(p.id)}
                    className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#d4af37] text-white shadow-xs scale-110 font-black ring-1 ring-amber-300'
                        : 'bg-white/80 hover:bg-white text-[#345847] border border-[#d2dfd7]'
                    }`}
                    title={`${p.name} (Klik untuk jadikan wallpaper)`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
              {photos.length > 7 && (
                <button
                  onClick={onOpenPhotoModal}
                  className="px-1 text-[10px] font-bold text-[#2d5945] hover:underline"
                  title="Lihat semua foto"
                >
                  +{photos.length - 7}
                </button>
              )}
            </div>
          )}

          {/* Tombol Kelola Galeri */}
          <button
            onClick={onOpenPhotoModal}
            className="ml-1 px-2 py-0.5 rounded-lg bg-[#2e5946] hover:bg-[#204233] text-white text-[10px] font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
            title="Kelola semua foto yang diunggah"
          >
            <FolderOpen className="w-3 h-3 text-[#fed774]" />
            <span className="hidden sm:inline">Kelola</span>
          </button>
        </div>
      </div>
    </div>
  );
};
