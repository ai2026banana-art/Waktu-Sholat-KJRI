import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Check,
  Trash2,
  Image as ImageIcon,
  RotateCw,
  Sparkles,
  Info,
  CheckCircle2,
  FolderOpen,
  Edit2,
} from 'lucide-react';
import {
  UploadedMosquePhoto,
  compressImage,
  savePhoto,
  deleteUploadedPhoto,
  setActivePhotoId,
  setAutoRotatePhotos,
  DEFAULT_INITIAL_PHOTOS,
  saveMultiplePhotos,
} from '../services/photoStorage';

interface MosquePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: UploadedMosquePhoto[];
  activePhotoId: string | null;
  autoRotate: boolean;
  onPhotoSelected: (photoId: string) => void;
  onPhotosUpdated: (newPhotos: UploadedMosquePhoto[]) => void;
  onAutoRotateToggled: (enabled: boolean) => void;
}

export const MosquePhotoModal: React.FC<MosquePhotoModalProps> = ({
  isOpen,
  onClose,
  photos,
  activePhotoId,
  autoRotate,
  onPhotoSelected,
  onPhotosUpdated,
  onAutoRotateToggled,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Tangani pengunggahan banyak foto sekaligus
  const handleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const newPhotosList: UploadedMosquePhoto[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        const { dataUrl, sizeKB } = await compressImage(file, 1920, 1080, 0.85);

        // Bersihkan ekstensi nama file untuk nama default
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

        const newPhoto: UploadedMosquePhoto = {
          id: `photo-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
          name: cleanName || `Foto Masjid ${photos.length + i + 1}`,
          dataUrl,
          uploadedAt: Date.now(),
          sizeKB,
        };

        await savePhoto(newPhoto);
        newPhotosList.push(newPhoto);
      }

      if (newPhotosList.length > 0) {
        const updated = [...newPhotosList, ...photos];
        onPhotosUpdated(updated);
        // Otomatis jadikan foto pertama yang baru diunggah sebagai aktif
        const firstNewId = newPhotosList[0].id;
        setActivePhotoId(firstNewId);
        onPhotoSelected(firstNewId);
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Gagal mengunggah foto');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Hapus foto terpilih
  const handleDeletePhoto = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (photos.length <= 1) {
      const confirmLast = window.confirm(
        'Ini adalah satu-satunya foto tersisa. Jika dihapus, sistem akan mengembalikan foto bawaan Masjid As Syafir. Lanjutkan?'
      );
      if (!confirmLast) return;
    }

    try {
      await deleteUploadedPhoto(id);
      const remaining = photos.filter((p) => p.id !== id);

      if (remaining.length === 0) {
        // Kembalikan default jika semua dihapus
        await saveMultiplePhotos(DEFAULT_INITIAL_PHOTOS);
        onPhotosUpdated(DEFAULT_INITIAL_PHOTOS);
        setActivePhotoId(DEFAULT_INITIAL_PHOTOS[0].id);
        onPhotoSelected(DEFAULT_INITIAL_PHOTOS[0].id);
      } else {
        onPhotosUpdated(remaining);
        // Jika yang dihapus adalah foto yang sedang aktif, pindah ke foto pertama
        if (activePhotoId === id) {
          const nextActiveId = remaining[0].id;
          setActivePhotoId(nextActiveId);
          onPhotoSelected(nextActiveId);
        }
      }
    } catch {
      // error handling
    }
  };

  // Simpan nama baru foto
  const handleSaveRename = async (id: string) => {
    if (!editingName.trim()) {
      setEditingPhotoId(null);
      return;
    }
    const updated = photos.map((p) => (p.id === id ? { ...p, name: editingName.trim() } : p));
    const target = updated.find((p) => p.id === id);
    if (target) {
      await savePhoto(target);
      onPhotosUpdated(updated);
    }
    setEditingPhotoId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#fdfcf9] rounded-3xl shadow-2xl border border-[#d9ccb4] overflow-hidden">
        {/* ============================================================ */}
        {/* HEADER MODAL                                                 */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#214334] to-[#34604d] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-[#ffea9f]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-wide">
                  Kelola Foto Wallpaper Masjid
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#d4af37] text-white">
                  {photos.length} Foto Tersimpan
                </span>
              </div>
              <p className="text-xs text-[#d1e3d9]">
                Unggah foto masjid dari perangkat Anda. Foto disimpan permanen di TV & dapat dipilih bebas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ============================================================ */}
        {/* BADAN MODAL: DROPZONE UNGGAH & DAFTAR FOTO                    */}
        {/* ============================================================ */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* AREA UNGGAH FOTO (BISA PILIH BANYAK SEKALIGUS) */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-[#b8ccbf] hover:border-[#3d6e57] bg-[#f2f7f4] hover:bg-[#eaf3ed] rounded-2xl p-5 text-center cursor-pointer transition-all group shadow-xs"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFilesUpload}
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#dbeae1] group-hover:bg-[#c9e1d2] flex items-center justify-center text-[#234b39] transition-transform group-hover:scale-110 shadow-xs">
                {isUploading ? (
                  <RotateCw className="w-6 h-6 animate-spin text-[#d4af37]" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-[#1b3d2f]">
                  {isUploading ? 'Sedang Memproses & Mengompres Foto...' : 'Klik atau Tarik Foto Masjid ke Sini'}
                </p>
                <p className="text-xs text-[#527766] mt-0.5">
                  Mendukung banyak foto sekaligus (JPG, PNG, WebP) · Kompresi otomatis resolusi TV Full HD
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[11px] font-bold text-[#234b39] border border-[#cbdcd1] shadow-2xs group-hover:border-[#3d6e57]">
                <FolderOpen className="w-3.5 h-3.5 text-[#c59e4b]" />
                Pilih Berkas dari Perangkat
              </span>
            </div>
          </div>

          {uploadError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* BILAH OPSI: ROTASI OTOMATIS BERSAMA PERGANTIAN AYAT */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#f5ede0]/60 border border-[#e5d8c3]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#e5cf9f] text-[#6b5015] flex items-center justify-center">
                <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '10s' }} />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-[#2b2518] block">
                  Rotasi Otomatis Foto Setiap 4 Menit
                </span>
                <span className="text-[11px] text-[#6b5a3e]">
                  {autoRotate
                    ? 'Aktif: Wallpaper berganti ke foto berikutnya setiap kali ayat berganti'
                    : 'Nonaktif: Mengunci satu foto yang Anda pilih sebagai wallpaper tetap'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const nextVal = !autoRotate;
                setAutoRotatePhotos(nextVal);
                onAutoRotateToggled(nextVal);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                autoRotate
                  ? 'bg-[#2b5945] text-white hover:bg-[#1f4233]'
                  : 'bg-white text-[#574421] border border-[#d6c4a5] hover:bg-[#faf4ec]'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${autoRotate ? 'opacity-100' : 'opacity-0'}`} />
              <span>{autoRotate ? 'Rotasi Aktif' : 'Kunci 1 Foto'}</span>
            </button>
          </div>

          {/* GALERI DAFTAR FOTO TERUNGGAH */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs sm:text-sm font-bold text-[#1b3d2f] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#c59e4b]" />
                Daftar Foto Wallpaper ({photos.length})
              </h4>
              <span className="text-[11px] text-[#5e7e70]">
                Klik foto mana saja untuk menjadikannya wallpaper aktif
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {photos.map((photo, index) => {
                const isActive = photo.id === activePhotoId;
                const isEditing = editingPhotoId === photo.id;

                return (
                  <div
                    key={photo.id}
                    onClick={() => {
                      setActivePhotoId(photo.id);
                      onPhotoSelected(photo.id);
                    }}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group bg-white shadow-xs hover:shadow-md flex flex-col justify-between ${
                      isActive
                        ? 'border-[#d4af37] ring-3 ring-[#d4af37]/30 scale-[1.01]'
                        : 'border-[#dfd7c7] hover:border-[#679982]'
                    }`}
                  >
                    {/* Gambar Thumbnail */}
                    <div className="relative aspect-video w-full bg-[#e8eee9] overflow-hidden">
                      <img
                        src={photo.dataUrl}
                        alt={photo.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Overlay Gelap Halus Saat Hover */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                      {/* Badge Aktif */}
                      {isActive && (
                        <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-[#d4af37] text-white text-[10px] font-black tracking-wider flex items-center gap-1 shadow-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>WALLPAPER AKTIF</span>
                        </div>
                      )}

                      {/* Nomor Urut */}
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold flex items-center justify-center">
                        #{index + 1}
                      </div>

                      {/* Tombol Hapus */}
                      <button
                        onClick={(e) => handleDeletePhoto(photo.id, e)}
                        className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-red-600 text-white transition-colors cursor-pointer shadow-xs"
                        title="Hapus foto ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Metadata & Nama Foto */}
                    <div className="p-3 flex items-center justify-between gap-2 bg-[#faf9f5]">
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(photo.id);
                                if (e.key === 'Escape') setEditingPhotoId(null);
                              }}
                              className="text-xs px-2 py-0.5 rounded border border-[#3b6b55] w-full bg-white font-bold text-[#1b3d2f] focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveRename(photo.id)}
                              className="p-1 rounded bg-[#2e5946] text-white"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-[#1a382b] truncate" title={photo.name}>
                              {photo.name}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPhotoId(photo.id);
                                setEditingName(photo.name);
                              }}
                              className="opacity-40 hover:opacity-100 p-0.5 text-[#5e7e70]"
                              title="Ubah nama label"
                            >
                              <Edit2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}
                        <p className="text-[10px] text-[#6d8a7c] mt-0.5">
                          {photo.sizeKB ? `${photo.sizeKB} KB` : 'Optimal'} ·{' '}
                          {new Date(photo.uploadedAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      </div>

                      {/* Tombol Status / Pilih */}
                      <div className="shrink-0">
                        {isActive ? (
                          <span className="text-[10px] font-black text-[#876800] bg-[#fff5d6] px-2 py-1 rounded-md border border-[#ecd59d]">
                            Dipilih
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#456b5a] group-hover:bg-[#2e5946] group-hover:text-white px-2 py-1 rounded-md transition-colors bg-white border border-[#c8ded3]">
                            Pilih
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* FOOTER MODAL                                                 */}
        {/* ============================================================ */}
        <div className="px-6 py-3.5 bg-[#f5f1e8] border-t border-[#dfd4c1] flex items-center justify-between gap-3">
          <div className="text-xs text-[#5f5442]">
            Total <strong className="text-[#1a382b]">{photos.length}</strong> foto tersimpan. Foto yang Anda pilih langsung tampil di kotak ayat Al-Qur'an.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#214334] to-[#34604d] hover:from-[#193529] hover:to-[#284c3c] text-white text-xs font-bold tracking-wide shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 text-[#ffd978]" />
            <span>Selesai & Simpan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
