import { useState, useEffect } from 'react';
import { generateAportes, generateMoraIndices } from '../data-utils';
import { TOTAL_STUDENTS } from '../constants';

export function useStudentData() {
  const [aportes, setAportes] = useState<number[]>([]);
  const [moraIndices, setMoraIndices] = useState<number[]>([]);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number>(0);

  useEffect(() => {
    const aportes = generateAportes();
    const moraIndices = generateMoraIndices();
    
    setAportes(aportes);
    setMoraIndices(moraIndices);
    
    // Select random student (not in mora)
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * TOTAL_STUDENTS);
    } while (moraIndices.includes(randomIndex));
    setSelectedStudentIndex(randomIndex);
  }, []);

  const handleAporteChange = (newAporte: number) => {
    setAportes(prev => {
      const updated = [...prev];
      updated[selectedStudentIndex] = newAporte;
      return updated;
    });
  };

  return {
    aportes,
    moraIndices,
    selectedStudentIndex,
    setSelectedStudentIndex,
    handleAporteChange
  };
}
