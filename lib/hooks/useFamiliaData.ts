import { useState, useEffect } from 'react';
import { generateAportes, generateMoraIndices } from '../data-utils';
import { NUMBER_OF_FAMILIES } from '../constants';
import type { Aporte } from '../types';

export function useFamiliaData() {
  const [aportes, setAportes] = useState<Aporte[][]>([]);
  const [moraIndices, setMoraIndices] = useState<number[]>([]);
  const [designatedFamiliaIndex, setDesignatedFamiliaIndex] = useState<number>(0);
  const [initialAportes, setInitialAportes] = useState<Aporte[][]>([]);

  useEffect(() => {
    const generatedAportes = generateAportes();
    const generatedMoraIndices = generateMoraIndices();
    
    setAportes(generatedAportes);
    setInitialAportes(generatedAportes);
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
      const initialFamiliaAportes = initialAportes[designatedFamiliaIndex];

      if (initialFamiliaAportes) {
        const multiplier = 1 + percentageChange / 100;
        
        const updatedFamiliaAportes = initialFamiliaAportes.map((initialAporte) => {
          const newValue = initialAporte.value * multiplier;
          return {
            ...initialAporte, // Keep the same ID
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

  // Helper function to get initial sum of aportes for a familia
  const getInitialFamiliaAportesSum = (familiaIndex: number) => {
    return initialAportes[familiaIndex]?.reduce((sum, aporte) => sum + aporte.value, 0) || 0;
  };

  return {
    aportes,
    moraIndices,
    designatedFamiliaIndex,
    handleAporteChange,
    getFamiliaAportesSum,
    getInitialFamiliaAportesSum
  };
}
