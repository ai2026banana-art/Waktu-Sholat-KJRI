import React from 'react';

interface MosqueBackdropProps {
  activePhotoUrl?: string | null;
}

/**
 * Latar Belakang Artistik Masjid Dunia dengan Nuansa Lembut, Terang & Spiritual:
 * - Nuansa diselaraskan dengan foto masjid aktif yang diunggah
 * - Siluet arsitektur kubah dan menara masjid berpalet hijau sage pucat & aksen emas lembut
 * - Pola geometri islami halus di sudut layar
 * - Overlay putih-krem transparan yang memberikan kontras maksimal pada tipografi
 */
export const MosqueBackdrop: React.FC<MosqueBackdropProps> = ({ activePhotoUrl }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Latar Foto Masjid dengan Efek Blur Lembut & Suasana Spiritual */}
      {activePhotoUrl ? (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={activePhotoUrl}
            alt="Latar Masjid"
            className="w-full h-full object-cover object-center filter blur-[28px] opacity-25 scale-110 transition-opacity duration-1000"
          />
        </div>
      ) : null}

      {/* Gradien Langit Sage Lembut */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#e3eff2] via-[#edf4ef] to-[#f8f6f0] opacity-60 transition-all duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-transparent to-white/65 pointer-events-none" />

      {/* 2. Cahaya Pagi Hangat & Berpendar di Cakrawala */}
      <div
        className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[90vw] h-[45vh] rounded-full blur-[110px] pointer-events-none opacity-45"
        style={{
          background: 'radial-gradient(circle, rgba(253, 230, 138, 0.6) 0%, rgba(220, 240, 230, 0.4) 40%, transparent 75%)',
        }}
      />

      {/* 3. Awan Halus & Tekstur Langit Damai */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%), radial-gradient(ellipse at 75% 35%, rgba(254,243,199,0.7) 0%, transparent 60%)',
        }}
      />

      {/* 4. Siluet Berlapis Arsitektur Kubah & Menara Masjid Dunia (Palet Sage Pucat) */}
      {/* Lapisan Masjid Latar Jauh (Soft Sage Mist) */}
      <svg
        viewBox="0 0 1920 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute bottom-[10%] left-0 w-full h-[40vh] opacity-25 filter blur-[1.8px]"
      >
        <rect x="220" y="80" width="16" height="400" rx="3" fill="#88a89b" />
        <path d="M228 30 L238 80 L218 80 Z" fill="#88a89b" />
        <rect x="360" y="140" width="14" height="340" rx="2" fill="#88a89b" />
        <path d="M367 90 L376 140 L358 140 Z" fill="#88a89b" />

        <rect x="1540" y="120" width="16" height="360" rx="3" fill="#88a89b" />
        <path d="M1548 70 L1558 120 L1538 120 Z" fill="#88a89b" />
        <rect x="1680" y="70" width="18" height="410" rx="3" fill="#88a89b" />
        <path d="M1689 20 L1700 70 L1678 70 Z" fill="#88a89b" />

        {/* Kubah-kubah Megah di Latar Belakang */}
        <path d="M 120 480 Q 200 240 280 480 Z" fill="#9bbab0" />
        <path d="M 680 500 Q 960 210 1240 500 Z" fill="#8baea2" />
        <path d="M 1420 490 Q 1520 280 1620 490 Z" fill="#9bbab0" />
      </svg>

      {/* Lapisan Masjid Latar Tengah dengan Aksen Emas Pucat & Sage Modern */}
      <svg
        viewBox="0 0 1920 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-[46vh] opacity-30 filter blur-[0.6px]"
      >
        <defs>
          <linearGradient id="sageGoldSoft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.75" />
            <stop offset="20%" stopColor="#78998c" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#93b0a4" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Menara Kiri */}
        <rect x="140" y="90" width="22" height="500" rx="4" fill="url(#sageGoldSoft)" />
        <polygon points="151,35 164,90 138,90" fill="#c5a059" />
        <circle cx="151" cy="28" r="4" fill="#e5c578" />

        <rect x="420" y="160" width="18" height="430" rx="3" fill="#88a89b" />
        <polygon points="429,110 440,160 418,160" fill="#c5a059" />

        {/* Menara Kanan */}
        <rect x="1480" y="150" width="18" height="440" rx="3" fill="#88a89b" />
        <polygon points="1489,100 1500,150 1478,150" fill="#c5a059" />

        <rect x="1760" y="80" width="24" height="510" rx="4" fill="url(#sageGoldSoft)" />
        <polygon points="1772,25 1786,80 1758,80" fill="#c5a059" />
        <circle cx="1772" cy="18" r="4" fill="#e5c578" />

        {/* Kubah Pusat Megah */}
        <path
          d="M 640 600 L 640 400 C 640 370 720 220 960 190 C 1200 220 1280 370 1280 400 L 1280 600 Z"
          fill="url(#sageGoldSoft)"
        />
        {/* Bulan Sabit & Finial Puncak Kubah */}
        <line x1="960" y1="190" x2="960" y2="155" stroke="#d4af37" strokeWidth="3" />
        <circle cx="960" cy="148" r="7" stroke="#d4af37" strokeWidth="2.5" fill="none" />

        {/* Kubah Pendamping */}
        <path
          d="M 380 600 L 380 430 C 380 400 440 300 580 290 C 720 300 780 400 780 430 L 780 600 Z"
          fill="#8caea3"
        />
        <path
          d="M 1140 600 L 1140 430 C 1140 400 1200 300 1340 290 C 1480 300 1540 400 1540 430 L 1540 600 Z"
          fill="#8caea3"
        />

        {/* Dinding Arsitektur Bawah */}
        <rect x="0" y="470" width="1920" height="130" fill="#a4c2b7" opacity="0.6" />
      </svg>

      {/* 5. Pola Geometri Islami Halus di Sudut Layar (Emas Pucat & Sage) */}
      <div className="absolute top-3 left-3 w-16 h-16 opacity-35 pointer-events-none text-[#bfa368]">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M 50 0 L 61 38 L 100 50 L 61 62 L 50 100 L 39 62 L 0 50 L 39 38 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 50 50)" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="absolute top-3 right-3 w-16 h-16 opacity-35 pointer-events-none text-[#bfa368]">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M 50 0 L 61 38 L 100 50 L 61 62 L 50 100 L 39 62 L 0 50 L 39 38 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 50 50)" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="absolute bottom-3 left-3 w-16 h-16 opacity-35 pointer-events-none text-[#bfa368]">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M 50 0 L 61 38 L 100 50 L 61 62 L 50 100 L 39 62 L 0 50 L 39 38 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 50 50)" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="absolute bottom-3 right-3 w-16 h-16 opacity-35 pointer-events-none text-[#bfa368]">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M 50 0 L 61 38 L 100 50 L 61 62 L 50 100 L 39 62 L 0 50 L 39 38 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 50 50)" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* 6. Overlay Putih-Krem Transparan (Memberikan Ruang Tenang & Kontras Teks Bersih) */}
      <div className="absolute inset-0 bg-[#f9f8f4]/60 backdrop-blur-[1px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#f5f3ec]/85 via-transparent to-[#f5f3ec]/80 pointer-events-none" />
    </div>
  );
};
