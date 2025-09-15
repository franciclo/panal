import { useState, useEffect } from 'react';
import { generateAportes, generateMoraIndices } from '../data-utils';
import { NUMBER_OF_FAMILIES, BUDGET } from '../constants';
import type { Aporte } from '../types';

export function useFamiliaData() {
  const [aportes, setAportes] = useState<Aporte[][]>([]);
  const [moraIndices, setMoraIndices] = useState<number[]>([]);
  const [designatedFamiliaIndex, setDesignatedFamiliaIndex] = useState<number>(0);
  const [controlledBudget, setControlledBudget] = useState<number>(BUDGET);

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
      const standardPayment = getDynamicStandardPayment();

      if (familiaAportes) {
        const multiplier = 1 + percentageChange / 100;
        
        const updatedFamiliaAportes = familiaAportes.map((aporte) => {
          // Calculate new value based on average payment baseline
          const newValue = standardPayment * multiplier;
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


  // Calculate dynamic average payment based on controlled budget
  const getDynamicStandardPayment = () => {
    const totalAportes = aportes.flat().length;
    return totalAportes > 0 ? controlledBudget / totalAportes : 0;
  };

  // Calculate the average baseline for a family (average payment × number of aportes)
  const getFamiliaStandardBaseline = (familiaIndex: number) => {
    const familiaAportes = aportes[familiaIndex];
    const averagePayment = getDynamicStandardPayment();
    return familiaAportes ? familiaAportes.length * averagePayment : 0;
  };

  // Calculate percentage change from average baseline
  const getFamiliaPercentageFromStandard = (familiaIndex: number) => {
    const currentSum = getFamiliaAportesSum(familiaIndex);
    const averageBaseline = getFamiliaStandardBaseline(familiaIndex);
    return averageBaseline > 0 ? ((currentSum / averageBaseline) - 1) * 100 : 0;
  };

  return {
    aportes,
    moraIndices,
    designatedFamiliaIndex,
    handleAporteChange,
    getFamiliaAportesSum,
    controlledBudget,
    setControlledBudget,
    getDynamicStandardPayment,
    getFamiliaStandardBaseline,
    getFamiliaPercentageFromStandard
  };
}
