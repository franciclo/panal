import { useState, useEffect } from 'react';
import { generateAportes, generateMoraIndices } from '../data-utils';
import { NUMBER_OF_FAMILIES, STANDARD_PAYMENT } from '../constants';
import type { Aporte } from '../types';

export function useFamiliaData() {
  const [aportes, setAportes] = useState<Aporte[][]>([]);
  const [moraIndices, setMoraIndices] = useState<number[]>([]);
  const [designatedFamiliaIndex, setDesignatedFamiliaIndex] = useState<number>(0);

  useEffect(() => {
    const generatedAportes = generateAportes();
    const generatedMoraIndices = generateMoraIndices();
    
    setAportes(generatedAportes);
    setMoraIndices(generatedMoraIndices);
    
    // Select a random family (not in mora) as the designated family
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * NUMBER_OF_FAMILIES);
    } while (generatedMoraIndices.includes(randomIndex));
    setDesignatedFamiliaIndex(randomIndex);
  }, []);

  const handleAporteChange = (percentageChange: number) => {
    setAportes(prev => {
      const updated = [...prev];
      const familiaAportes = prev[designatedFamiliaIndex];

      if (familiaAportes) {
        const multiplier = 1 + percentageChange / 100;
        
        const updatedFamiliaAportes = familiaAportes.map((aporte) => {
          // Calculate new value based on STANDARD_PAYMENT baseline (consistent with data generation)
          const newValue = STANDARD_PAYMENT * multiplier;
          return {
            ...aporte, // Keep the same ID
            value: newValue,
          };
        });
        updated[designatedFamiliaIndex] = updatedFamiliaAportes;
      }
      
      return updated;
    });
  };

  // Helper function to get sum of aportes for a familia
  const getFamiliaAportesSum = (familiaIndex: number) => {
    return aportes[familiaIndex]?.reduce((sum, aporte) => sum + aporte.value, 0) || 0;
  };

  // Calculate the standard baseline for a family (STANDARD_PAYMENT × number of aportes)
  const getFamiliaStandardBaseline = (familiaIndex: number) => {
    const familiaAportes = aportes[familiaIndex];
    return familiaAportes ? familiaAportes.length * STANDARD_PAYMENT : 0;
  };

  // Calculate percentage change from standard baseline
  const getFamiliaPercentageFromStandard = (familiaIndex: number) => {
    const currentSum = getFamiliaAportesSum(familiaIndex);
    const standardBaseline = getFamiliaStandardBaseline(familiaIndex);
    return standardBaseline > 0 ? ((currentSum / standardBaseline) - 1) * 100 : 0;
  };

  return {
    aportes,
    moraIndices,
    designatedFamiliaIndex,
    handleAporteChange,
    getFamiliaAportesSum,
    getFamiliaStandardBaseline,
    getFamiliaPercentageFromStandard
  };
}
