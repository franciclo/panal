import { TOTAL_STUDENTS, MORA_COUNT, STANDARD_PAYMENT, MIN_PAYMENT, MAX_PAYMENT } from './constants';
import { formatAbbreviated } from './format-utils';
import type { PaymentStats, Aporte } from './types';

// Generate student payments - now returns Aporte objects with unique IDs
export function generateAportes(): Aporte[][] {
  return Array.from({ length: TOTAL_STUDENTS }, (_, studentIndex) => {
    const aportesCount = Math.floor(Math.random() * 3) + 1; // 1-3 aportes per user
    return Array.from({ length: aportesCount }, (_, aporteIndex) => {
      let value: number;
      // 90% pay standard amount (450k-600k)
      if (Math.random() < 0.9) {
        value = STANDARD_PAYMENT + Math.floor(Math.random() * 100000) - 50000;
      } else {
        // 10% have scholarships or donations (100k-1.1M)
        value = Math.floor(Math.random() * MAX_PAYMENT) + MIN_PAYMENT;
      }
      return {
        id: `student-${studentIndex}-aporte-${aporteIndex}`,
        value,
      };
    });
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
export function calculatePaymentStats(aportes: Aporte[][], moraIndices: number[]): PaymentStats {
  const moraAportes = aportes.filter((_, i) => moraIndices.includes(i)).flat();
  const nonMoraAportes = aportes.filter((_, i) => !moraIndices.includes(i)).flat();
  
  const donaciones = nonMoraAportes.filter(aporte => aporte.value > STANDARD_PAYMENT);
  const becas = nonMoraAportes.filter(aporte => aporte.value < STANDARD_PAYMENT);

  const moraSum = moraAportes.reduce((sum, aporte) => sum + aporte.value, 0);
  const donacionesSum = donaciones.reduce((sum, aporte) => sum + (aporte.value - STANDARD_PAYMENT), 0);
  const becasSum = becas.reduce((sum, aporte) => sum + (STANDARD_PAYMENT - aporte.value), 0);

  return {
    mora: {
      sum: moraSum,
      count: moraAportes.length,
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
