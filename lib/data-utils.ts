import { TOTAL_STUDENTS, MORA_COUNT, STANDARD_PAYMENT, MIN_PAYMENT, MAX_PAYMENT } from './constants';
import { formatAbbreviated } from './format-utils';
import type { PaymentStats } from './types';

// Generate student payments
export function generateAportes(): number[] {
  return Array.from({ length: TOTAL_STUDENTS }, () => {
    // 90% pay standard amount (450k-600k)
    if (Math.random() < 0.9) {
      return STANDARD_PAYMENT + Math.floor(Math.random() * 100000) - 50000;
    }
    // 10% have scholarships or donations (100k-1.1M)
    return Math.floor(Math.random() * MAX_PAYMENT) + MIN_PAYMENT;
  });
}

// Generate overdue payment indices
export function generateMoraIndices(): number[] {
  const indices = new Set<number>();
  while (indices.size < MORA_COUNT) {
    indices.add(Math.floor(Math.random() * TOTAL_STUDENTS));
  }
  return Array.from(indices);
}

// Calculate payment statistics
export function calculatePaymentStats(aportes: number[], moraIndices: number[]): PaymentStats {
  const mora = aportes.filter((_, i) => moraIndices.includes(i));
  const donaciones = aportes.filter((aporte, i) => !moraIndices.includes(i) && aporte > STANDARD_PAYMENT);
  const becas = aportes.filter((aporte, i) => !moraIndices.includes(i) && aporte < STANDARD_PAYMENT);

  const moraSum = mora.reduce((sum, aporte) => sum + aporte, 0);
  const donacionesSum = donaciones.reduce((sum, aporte) => sum + (aporte - STANDARD_PAYMENT), 0);
  const becasSum = becas.reduce((sum, aporte) => sum + (STANDARD_PAYMENT - aporte), 0);

  return {
    mora: {
      sum: moraSum,
      count: mora.length,
      formatted: formatAbbreviated(moraSum)
    },
    donaciones: {
      sum: donacionesSum,
      count: donaciones.length,
      formatted: '+' + formatAbbreviated(donacionesSum)
    },
    becas: {
      sum: becasSum,
      count: becas.length,
      formatted: '-' + formatAbbreviated(becasSum)
    }
  };
}
