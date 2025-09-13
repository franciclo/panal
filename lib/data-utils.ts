import { NUMBER_OF_FAMILIES, TOTAL_APORTES, MORA_COUNT, STANDARD_PAYMENT, MIN_PAYMENT, MAX_PAYMENT } from './constants';
import { formatAbbreviated } from './format-utils';
import type { PaymentStats, Aporte } from './types';

// Helper to create a single aporte
const createAporte = (familiaIndex: number, aporteIndex: number): Aporte => {
  let value: number;
  if (Math.random() < 0.9) {
    value = STANDARD_PAYMENT + Math.floor(Math.random() * 100000) - 50000;
  } else {
    value = Math.floor(Math.random() * MAX_PAYMENT) + MIN_PAYMENT;
  }
  return {
    id: `familia-${familiaIndex}-aporte-${aporteIndex}`,
    value,
  };
};

// Generate family payments to ensure exactly TOTAL_APORTES are created
export function generateAportes(): Aporte[][] {
  const aportesByFamilia: Aporte[][] = Array.from({ length: NUMBER_OF_FAMILIES }, (_, familiaIndex) => {
    // Each family starts with one aporte
    return [createAporte(familiaIndex, 0)];
  });

  const remainingAportes = TOTAL_APORTES - NUMBER_OF_FAMILIES;

  for (let i = 0; i < remainingAportes; i++) {
    // Add the remaining aportes to random families
    const randomFamiliaIndex = Math.floor(Math.random() * NUMBER_OF_FAMILIES);
    const newAporteIndex = aportesByFamilia[randomFamiliaIndex].length;
    aportesByFamilia[randomFamiliaIndex].push(createAporte(randomFamiliaIndex, newAporteIndex));
  }

  return aportesByFamilia;
}

// Generate overdue payment indices based on the number of families
export function generateMoraIndices(): number[] {
  const indices = new Set<number>();
  while (indices.size < MORA_COUNT) {
    indices.add(Math.floor(Math.random() * NUMBER_OF_FAMILIES));
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
