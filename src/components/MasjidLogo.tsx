import React from 'react';

interface MasjidLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

/**
 * Komponen Vektor Resmi Logo Masjid Indonesia As Syifa (KJRI Kuching)
 * Sesuai foto emblem pada poster resmi:
 * - Bingkai lingkaran emas bermotif
 * - Teks melingkar "MASJID INDONESIA AS-SYIFA" dan "KJRI KUCHING"
 * - Kubah masjid megah dengan bulan bintang (Hilal)
 * - Menara kembar di kanan-kiri
 * - Motif bintang geometri islami 8 penjuru di bagian bawah kubah
 */
export const MasjidLogo: React.FC<MasjidLogoProps> = ({
  className = '',
  size = 64,
  showText = false,
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_2px_8px_rgba(217,119,6,0.35)]"
      >
        <defs>
          {/* Gradien Emas Mewah */}
          <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="35%" stopColor="#D97706" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="emeraldBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#064E3B" />
            <stop offset="50%" stopColor="#042F24" />
            <stop offset="100%" stopColor="#021C16" />
          </linearGradient>

          {/* Jalur Teks Melingkar Atas */}
          <path
            id="textPathTop"
            d="M 28 100 A 72 72 0 0 1 172 100"
            fill="none"
          />
          {/* Jalur Teks Melingkar Bawah */}
          <path
            id="textPathBottom"
            d="M 172 100 A 72 72 0 0 1 28 100"
            fill="none"
          />
        </defs>

        {/* 1. Lingkaran Luar Motif Emas Bertekstur */}
        <circle cx="100" cy="100" r="96" stroke="url(#goldRing)" strokeWidth="3" fill="#042A20" />
        <circle cx="100" cy="100" r="91" stroke="url(#goldRing)" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.8" />
        <circle cx="100" cy="100" r="86" stroke="url(#goldRing)" strokeWidth="1.5" fill="none" />

        {/* 2. Pita Lingkaran untuk Teks Nama Masjid */}
        <circle cx="100" cy="100" r="68" stroke="url(#goldRing)" strokeWidth="1.5" fill="url(#emeraldBase)" />

        {/* 3. Teks Melingkar Atas: MASJID INDONESIA AS SYAFIR */}
        <text
          fill="#FDE68A"
          fontSize="10.5"
          fontWeight="bold"
          letterSpacing="1.5"
          className="font-sans"
        >
          <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
            MASJID INDONESIA AS SYAFIR
          </textPath>
        </text>

        {/* Titik Pemisah Bintang Emas */}
        <circle cx="27" cy="100" r="2.5" fill="#FBBF24" />
        <circle cx="173" cy="100" r="2.5" fill="#FBBF24" />

        {/* 4. Teks Melingkar Bawah: KJRI KUCHING */}
        <text
          fill="#FDE68A"
          fontSize="11"
          fontWeight="bold"
          letterSpacing="2.2"
          className="font-sans"
        >
          <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
            KJRI KUCHING
          </textPath>
        </text>

        {/* 5. Lingkaran Inti Pusat Masjid */}
        <circle cx="100" cy="100" r="64" stroke="url(#goldRing)" strokeWidth="2" fill="#022119" />

        {/* 6. Gambar Vektor Kubah Masjid & Menara */}
        {/* Siluet Menara Kiri */}
        <rect x="52" y="70" width="7" height="60" rx="1.5" fill="none" stroke="url(#goldRing)" strokeWidth="1.2" />
        <path d="M 50 70 L 55.5 54 L 61 70 Z" fill="none" stroke="url(#goldRing)" strokeWidth="1.2" />
        <circle cx="55.5" cy="51" r="1.5" fill="#FBBF24" />

        {/* Siluet Menara Kanan */}
        <rect x="141" y="70" width="7" height="60" rx="1.5" fill="none" stroke="url(#goldRing)" strokeWidth="1.2" />
        <path d="M 139 70 L 144.5 54 L 150 70 Z" fill="none" stroke="url(#goldRing)" strokeWidth="1.2" />
        <circle cx="144.5" cy="51" r="1.5" fill="#FBBF24" />

        {/* Kubah Utama Pusat */}
        <path
          d="M 64 125 L 64 98 C 64 85 80 66 100 62 C 120 66 136 85 136 98 L 136 125 Z"
          fill="#063D2F"
          stroke="url(#goldRing)"
          strokeWidth="1.8"
        />

        {/* Detail Garis Lengkung Kubah */}
        <path
          d="M 80 125 C 80 92 90 74 100 66 C 110 74 120 92 120 125"
          fill="none"
          stroke="url(#goldRing)"
          strokeWidth="1"
          opacity="0.8"
        />

        {/* Finial Tiang & Bulan Bintang (Hilal) di Puncak Kubah */}
        <line x1="100" y1="62" x2="100" y2="48" stroke="url(#goldRing)" strokeWidth="1.8" />
        {/* Bulan Sabit */}
        <path
          d="M 103 44 C 103 40.5 99.5 38 96.5 40 C 99 41.5 99.5 44 98.5 46.5 C 97.5 49 95 49.5 93 49 C 96 52 103 50 103 44 Z"
          fill="#FDE68A"
        />
        {/* Bintang Kecil */}
        <circle cx="94" cy="43" r="1.2" fill="#FBBF24" />

        {/* 7. Motif Bintang Geometri Islami 8 Penjuru di Bawah Kubah */}
        <g transform="translate(100, 114) scale(0.65)">
          <polygon
            points="0,-18 5,-5 18,0 5,5 0,18 -5,5 -18,0 -5,-5"
            stroke="url(#goldRing)"
            strokeWidth="1.5"
            fill="#064E3B"
          />
          <rect
            x="-9"
            y="-9"
            width="18"
            height="18"
            stroke="url(#goldRing)"
            strokeWidth="1.2"
            fill="none"
            transform="rotate(45)"
          />
          <circle cx="0" cy="0" r="3.5" fill="#FBBF24" />
        </g>

        {/* Garis Dasar Bawah */}
        <line x1="46" y1="130" x2="154" y2="130" stroke="url(#goldRing)" strokeWidth="1.5" />
      </svg>

      {showText && (
        <div className="ml-3 text-left">
          <span className="block text-lg font-black text-amber-300 tracking-wider uppercase font-sans drop-shadow-sm">
            Masjid Indonesia As Syafir
          </span>
          <span className="block text-xs font-semibold text-emerald-200 tracking-wide">
            KJRI Kuching, Sarawak, Malaysia
          </span>
        </div>
      )}
    </div>
  );
};
