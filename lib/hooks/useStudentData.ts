import { useState, useEffect } from 'react';
import { generateAportes, generateMoraIndices } from '../data-utils';
import { TOTAL_STUDENTS } from '../constants';
import type { Aporte } from '../types';

export function useStudentData() {
  const [aportes, setAportes] = useState<Aporte[][]>([]);
  const [moraIndices, setMoraIndices] = useState<number[]>([]);
  const [designatedUserIndex, setDesignatedUserIndex] = useState<number>(0);
  const [initialAportes, setInitialAportes] = useState<Aporte[][]>([]);

  useEffect(() => {
    const generatedAportes = generateAportes();
    const generatedMoraIndices = generateMoraIndices();
    
    setAportes(generatedAportes);
    setInitialAportes(generatedAportes);
    setMoraIndices(generatedMoraIndices);
    
    // Select a random user (not in mora) as the designated user
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * TOTAL_STUDENTS);
    } while (generatedMoraIndices.includes(randomIndex));
    setDesignatedUserIndex(randomIndex);
  }, []);

  const handleAporteChange = (percentageChange: number) => {
    setAportes(prev => {
      const updated = [...prev];
      const initialUserAportes = initialAportes[designatedUserIndex];

      if (initialUserAportes) {
        const multiplier = 1 + percentageChange / 100;
        
        const updatedUserAportes = initialUserAportes.map(initialAporte => ({
          ...initialAporte, // Keep the same ID
          value: initialAporte.value * multiplier,
        }));
        updated[designatedUserIndex] = updatedUserAportes;
      }
      
      return updated;
    });
  };

  // Helper function to get sum of aportes for a user
  const getUserAportesSum = (userIndex: number) => {
    return aportes[userIndex]?.reduce((sum, aporte) => sum + aporte.value, 0) || 0;
  };

  // Helper function to get initial sum of aportes for a user
  const getInitialUserAportesSum = (userIndex: number) => {
    return initialAportes[userIndex]?.reduce((sum, aporte) => sum + aporte.value, 0) || 0;
  };

  return {
    aportes,
    moraIndices,
    designatedUserIndex,
    handleAporteChange,
    getUserAportesSum,
    getInitialUserAportesSum
  };
}
