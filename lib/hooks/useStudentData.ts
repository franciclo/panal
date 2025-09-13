import { useState, useEffect } from 'react';
import { generateAportes, generateMoraIndices } from '../data-utils';
import { TOTAL_STUDENTS } from '../constants';

export function useStudentData() {
  const [aportes, setAportes] = useState<number[]>([]);
  const [moraIndices, setMoraIndices] = useState<number[]>([]);
  const [designatedUserIndex, setDesignatedUserIndex] = useState<number>(0);

  useEffect(() => {
    const generatedAportes = generateAportes();
    const generatedMoraIndices = generateMoraIndices();
    
    setAportes(generatedAportes);
    setMoraIndices(generatedMoraIndices);
    
    // Select a random user (not in mora) as the designated user
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * TOTAL_STUDENTS);
    } while (generatedMoraIndices.includes(randomIndex));
    setDesignatedUserIndex(randomIndex);
  }, []);

  const handleAporteChange = (newAporte: number) => {
    setAportes(prev => {
      const updated = [...prev];
      updated[designatedUserIndex] = newAporte;
      return updated;
    });
  };

  return {
    aportes,
    moraIndices,
    designatedUserIndex,
    handleAporteChange
  };
}
