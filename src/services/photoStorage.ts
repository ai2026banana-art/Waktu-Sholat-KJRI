/**
 * Layanan Penyimpanan Foto Masjid (IndexedDB & LocalStorage Fallback)
 * Memungkinkan pengunggahan banyak foto masjid, kompresi otomatis agar ringan di memori TV,
 * pemilihan foto aktif, dan penyimpanan permanen antar reload aplikasi.
 */

export interface UploadedMosquePhoto {
  id: string;
  name: string;
  dataUrl: string;
  uploadedAt: number;
  sizeKB: number;
}

const DB_NAME = 'MasjidIndonesiaAsSyafir_DB';
const DB_VERSION = 1;
const STORE_NAME = 'mosque_photos';

const ACTIVE_PHOTO_ID_KEY = 'masjid_active_photo_id';
const AUTO_ROTATE_PHOTOS_KEY = 'masjid_auto_rotate_photos';

// Foto bawaan awal (placeholder masjid indah beresolusi optimal jika pengguna belum mengunggah foto)
export const DEFAULT_INITIAL_PHOTOS: UploadedMosquePhoto[] = [
  {
    id: 'default-masjid-1',
    name: 'Masjid Indonesia As Syafir (Luar)',
    // Menggunakan SVG Data URI artistik berarsitektur masjid modern hijau sage & kubah emas lembut
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><defs><linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%23d8ebf0"/><stop offset="50%" stop-color="%23e8f4ed"/><stop offset="100%" stop-color="%23f9f7f2"/></linearGradient><linearGradient id="domeGold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23fff1b8"/><stop offset="50%" stop-color="%23d4af37"/><stop offset="100%" stop-color="%239a7b20"/></linearGradient><linearGradient id="wallSage" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%23ffffff"/><stop offset="100%" stop-color="%23e5efe9"/></linearGradient></defs><rect width="1280" height="720" fill="url(%23sky)"/><circle cx="640" cy="220" r="180" fill="%23fff8dc" opacity="0.35"/><path d="M 440 480 Q 640 180 840 480 Z" fill="url(%23domeGold)"/><circle cx="640" cy="180" r="18" fill="%23d4af37"/><rect x="420" y="470" width="440" height="250" fill="url(%23wallSage)" stroke="%23d0ded5" stroke-width="3"/><path d="M 580 720 L 580 540 Q 640 500 700 540 L 700 720 Z" fill="%231a382b"/><rect x="220" y="240" width="42" height="480" rx="6" fill="%23ffffff" stroke="%23cbdad1" stroke-width="2"/><polygon points="241,160 265,240 217,240" fill="url(%23domeGold)"/><circle cx="241" cy="150" r="8" fill="%23d4af37"/><rect x="1018" y="240" width="42" height="480" rx="6" fill="%23ffffff" stroke="%23cbdad1" stroke-width="2"/><polygon points="1039,160 1063,240 1015,240" fill="url(%23domeGold)"/><circle cx="1039" cy="150" r="8" fill="%23d4af37"/><text x="640" y="660" font-family="sans-serif" font-size="28" font-weight="bold" fill="%231a382b" text-anchor="middle" letter-spacing="3">MASJID INDONESIA AS SYAFIR</text><text x="640" y="695" font-family="sans-serif" font-size="16" fill="%23608573" text-anchor="middle" letter-spacing="1">KJRI KUCHING · SARAWAK</text></svg>`,
    uploadedAt: Date.now() - 3600000,
    sizeKB: 24,
  },
  {
    id: 'default-masjid-2',
    name: 'Kubah & Menara Emas As Syafir',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><defs><linearGradient id="twilight" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%231c382b"/><stop offset="60%" stop-color="%232d5643"/><stop offset="100%" stop-color="%23e8efe9"/></linearGradient><linearGradient id="warmGold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ffe58f"/><stop offset="50%" stop-color="%23d4af37"/><stop offset="100%" stop-color="%23876800"/></linearGradient></defs><rect width="1280" height="720" fill="url(%23twilight)"/><circle cx="980" cy="180" r="50" fill="%23fff7d6" opacity="0.85"/><circle cx="960" cy="170" r="45" fill="%23224434"/><path d="M 320 540 Q 640 160 960 540 Z" fill="url(%23warmGold)" opacity="0.95"/><rect x="280" y="520" width="720" height="200" fill="%23ffffff" opacity="0.9"/><path d="M 540 720 L 540 570 Q 640 520 740 570 L 740 720 Z" fill="%23162e23"/><rect x="140" y="160" width="38" height="560" rx="4" fill="%23ffffff" opacity="0.95"/><polygon points="159,80 180,160 138,160" fill="url(%23warmGold)"/><text x="640" y="670" font-family="sans-serif" font-size="26" font-weight="bold" fill="%231b3528" text-anchor="middle">SUASANA TENANG & SPIRITUAL</text></svg>`,
    uploadedAt: Date.now() - 1800000,
    sizeKB: 22,
  },
];

/**
 * Membuka koneksi IndexedDB
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return reject(new Error('IndexedDB tidak didukung'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Kompresi gambar client-side menggunakan HTML5 Canvas
 * Memastikan file JPG/PNG berukuran besar dari kamera HP/laptop dikompres secara efisien
 * menjadi ukuran optimal ~150-350KB tanpa kehilangan detail untuk layar TV.
 */
export async function compressImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.85
): Promise<{ dataUrl: string; sizeKB: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context error'));
        }

        // Gambar dengan smoothing berkualitas tinggi
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const sizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);
        resolve({ dataUrl, sizeKB });
      };
      img.onerror = () => reject(new Error('Gagal memuat gambar'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Gagal membaca berkas'));
    reader.readAsDataURL(file);
  });
}

/**
 * Mengambil semua foto masjid yang tersimpan
 */
export async function getAllUploadedPhotos(): Promise<UploadedMosquePhoto[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const photos = request.result as UploadedMosquePhoto[];
        if (photos && photos.length > 0) {
          resolve(photos.sort((a, b) => b.uploadedAt - a.uploadedAt));
        } else {
          saveMultiplePhotos(DEFAULT_INITIAL_PHOTOS).then(() => {
            resolve(DEFAULT_INITIAL_PHOTOS);
          }).catch(() => {
            resolve(DEFAULT_INITIAL_PHOTOS);
          });
        }
      };

      request.onerror = () => {
        resolve(fallbackGetLocalStoragePhotos());
      };
    });
  } catch {
    return fallbackGetLocalStoragePhotos();
  }
}

/**
 * Menyimpan satu foto masjid baru
 */
export async function savePhoto(photo: UploadedMosquePhoto): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(photo);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    fallbackSaveLocalStoragePhoto(photo);
  }
}

/**
 * Menyimpan banyak foto sekaligus
 */
export async function saveMultiplePhotos(photos: UploadedMosquePhoto[]): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      photos.forEach((p) => store.put(p));

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch {
    photos.forEach(fallbackSaveLocalStoragePhoto);
  }
}

/**
 * Menghapus foto dari penyimpanan
 */
export async function deleteUploadedPhoto(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    fallbackDeleteLocalStoragePhoto(id);
  }
}

/**
 * Mengambil ID foto masjid aktif yang sedang dipilih sebagai wallpaper
 */
export function getActivePhotoId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PHOTO_ID_KEY);
  } catch {
    return null;
  }
}

/**
 * Menyimpan ID foto masjid yang dipilih sebagai wallpaper
 */
export function setActivePhotoId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PHOTO_ID_KEY, id);
  } catch {
    // ignore
  }
}

/**
 * Status apakah foto masjid otomatis berotasi bersama pergantian ayat
 */
export function getAutoRotatePhotos(): boolean {
  try {
    const val = localStorage.getItem(AUTO_ROTATE_PHOTOS_KEY);
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
}

export function setAutoRotatePhotos(enabled: boolean): void {
  try {
    localStorage.setItem(AUTO_ROTATE_PHOTOS_KEY, String(enabled));
  } catch {
    // ignore
  }
}

// -------------------------------------------------------------
// Fallback Helper jika IndexedDB tidak tersedia
// -------------------------------------------------------------
const LS_PHOTOS_KEY = 'masjid_uploaded_photos_meta';

function fallbackGetLocalStoragePhotos(): UploadedMosquePhoto[] {
  try {
    const raw = localStorage.getItem(LS_PHOTOS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return DEFAULT_INITIAL_PHOTOS;
}

function fallbackSaveLocalStoragePhoto(photo: UploadedMosquePhoto): void {
  try {
    const photos = fallbackGetLocalStoragePhotos();
    const existingIdx = photos.findIndex((p) => p.id === photo.id);
    if (existingIdx >= 0) {
      photos[existingIdx] = photo;
    } else {
      photos.unshift(photo);
    }
    localStorage.setItem(LS_PHOTOS_KEY, JSON.stringify(photos.slice(0, 10)));
  } catch {
    // storage full
  }
}

function fallbackDeleteLocalStoragePhoto(id: string): void {
  try {
    const photos = fallbackGetLocalStoragePhotos().filter((p) => p.id !== id);
    localStorage.setItem(LS_PHOTOS_KEY, JSON.stringify(photos));
  } catch {
    // ignore
  }
}
