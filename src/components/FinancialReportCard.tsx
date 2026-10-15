import React from 'react';
import {
  MonthlyFinancialReport,
  calculateTotalIncome,
  calculateAvailableCash,
  formatRinggit,
} from '../data/financialData';
import { Wallet, Coins, TrendingDown } from 'lucide-react';

interface FinancialReportCardProps {
  report: MonthlyFinancialReport;
  onEdit?: () => void;
}

export const FinancialReportCard: React.FC<FinancialReportCardProps> = ({
  report,
  onEdit,
}) => {
  const totalIncome = calculateTotalIncome(report);
  const totalAvailable = calculateAvailableCash(report);

  return (
    <div className="w-full rounded-2xl md:rounded-3xl panel-glass-light border border-[#e2d5bd] shadow-md p-3 sm:p-3.5 flex flex-col justify-between">
      {/* Header Panel */}
      <div className="flex items-center justify-between pb-2 border-b border-[#e5dccb]">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-[#c59e4b] shrink-0" />
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#8c6b24] font-sans">
            LAPORAN KEUANGAN — {report.periodMonth.toUpperCase()}
          </h2>
        </div>
        <span className="text-[11px] text-[#527d6a] font-semibold">
          Diperbarui: {report.updatedDate}
        </span>
      </div>

      {/* Rincian Keuangan Bulanan */}
      <div className="space-y-2 py-2 text-xs">
        {/* Baris 1: Dana dari Bulan Sebelumnya */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#f6f9f7] border border-[#d6e5dd]">
          <span className="text-[#365949] font-semibold flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-[#c59e4b]" />
            <span>Dana dari Bulan Sebelumnya:</span>
          </span>
          <span className="font-mono font-bold text-sm text-[#183628]">
            {formatRinggit(report.previousMonthBalance)}
          </span>
        </div>

        {/* Baris 2: Pendapatan Jumat Minggu 1 s/d Minggu 4 (4 Kotak Ringkas) */}
        <div className="grid grid-cols-4 gap-2">
          <div className="px-2 py-1.5 rounded-xl bg-[#f7faf8] border border-[#dbe6e0] text-center">
            <span className="block text-[10px] text-[#557b6a] font-semibold">Jumat M-1</span>
            <span className="font-mono font-bold text-xs text-[#1c382b]">
              {formatRinggit(report.fridayWeek1)}
            </span>
          </div>
          <div className="px-2 py-1.5 rounded-xl bg-[#f7faf8] border border-[#dbe6e0] text-center">
            <span className="block text-[10px] text-[#557b6a] font-semibold">Jumat M-2</span>
            <span className="font-mono font-bold text-xs text-[#1c382b]">
              {formatRinggit(report.fridayWeek2)}
            </span>
          </div>
          <div className="px-2 py-1.5 rounded-xl bg-[#f7faf8] border border-[#dbe6e0] text-center">
            <span className="block text-[10px] text-[#557b6a] font-semibold">Jumat M-3</span>
            <span className="font-mono font-bold text-xs text-[#1c382b]">
              {formatRinggit(report.fridayWeek3)}
            </span>
          </div>
          <div className="px-2 py-1.5 rounded-xl bg-[#f7faf8] border border-[#dbe6e0] text-center">
            <span className="block text-[10px] text-[#557b6a] font-semibold">Jumat M-4</span>
            <span className="font-mono font-bold text-xs text-[#1c382b]">
              {formatRinggit(report.fridayWeek4)}
            </span>
          </div>
        </div>

        {/* Baris 3: Pengeluaran Bulanan vs Total Kas Tersedia */}
        <div className="grid grid-cols-2 gap-2">
          {/* Pengeluaran Bulanan */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#fdf2f2] border border-[#f5d0d0]">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-[#b91c1c]" />
              <span className="text-[11px] text-[#881337] font-semibold">
                Pengeluaran Bulan Ini:
              </span>
            </div>
            <span className="font-mono font-bold text-xs text-[#991b1b]">
              {formatRinggit(report.monthlyExpenses)}
            </span>
          </div>

          {/* Total Kas Tersedia (Disorot Warna Emas Lembut & Krem) */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#fef8ea] border border-[#e5cf96] shadow-xs">
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-[#c59e4b]" />
              <span className="text-[11px] font-extrabold text-[#785918] tracking-wide uppercase">
                Total Kas Tersedia:
              </span>
            </div>
            <span className="font-mono font-black text-sm text-[#8c6b24]">
              {formatRinggit(totalAvailable)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Keterangan Kas */}
      <div className="flex items-center justify-between text-[10px] text-[#698c7d] pt-1.5 border-t border-[#e5dccb]">
        <span>* Total Infaq 4 Jumat: {formatRinggit(totalIncome)}</span>
        <span>BKM Masjid Indonesia As Syafir · KJRI Kuching</span>
      </div>
    </div>
  );
};
