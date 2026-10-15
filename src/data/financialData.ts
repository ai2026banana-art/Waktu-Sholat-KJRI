export interface MonthlyFinancialReport {
  periodMonth: string; // e.g. "Oktober 2026"
  previousMonthBalance: number; // Dana dari Bulan Sebelumnya (RM)
  fridayWeek1: number; // Pendapatan Jumat Minggu 1 (RM)
  fridayWeek2: number; // Pendapatan Jumat Minggu 2 (RM)
  fridayWeek3: number; // Pendapatan Jumat Minggu 3 (RM)
  fridayWeek4: number; // Pendapatan Jumat Minggu 4 (RM)
  monthlyExpenses: number; // Pengeluaran Bulanan (RM)
  updatedDate: string; // e.g. "15 Oktober 2026"
}

export const DEFAULT_FINANCIAL_REPORT: MonthlyFinancialReport = {
  periodMonth: 'Oktober 2026',
  previousMonthBalance: 8240,
  fridayWeek1: 1420,
  fridayWeek2: 1580,
  fridayWeek3: 1350,
  fridayWeek4: 1650,
  monthlyExpenses: 2460,
  updatedDate: '15 Oktober 2026',
};

export function calculateTotalIncome(report: MonthlyFinancialReport): number {
  return report.fridayWeek1 + report.fridayWeek2 + report.fridayWeek3 + report.fridayWeek4;
}

export function calculateAvailableCash(report: MonthlyFinancialReport): number {
  const totalIncome = calculateTotalIncome(report);
  return report.previousMonthBalance + totalIncome - report.monthlyExpenses;
}

export function formatRinggit(amount: number): string {
  return `RM ${amount.toLocaleString('ms-MY')}`;
}
