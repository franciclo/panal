'use client';

import { useMemo } from 'react';
import { useStudentData } from '@/lib/hooks/useStudentData';
import { useDimensions } from '@/lib/hooks/useDimensions';
import { calculatePaymentStats } from '@/lib/data-utils';
import { StatsBar } from '@/components/StatsBar';
import { Toolbar } from '@/components/Toolbar';
import { HexagonCanvas } from '@/components/HexagonCanvas';

export default function Home() {
  const { aportes, moraIndices, selectedStudentIndex, setSelectedStudentIndex, handleAporteChange } = useStudentData();
  const dimensions = useDimensions();

  const presupuestoTotal = aportes.reduce((sum, aporte) => sum + aporte, 0);

  const stats = useMemo(() => {
    return calculatePaymentStats(aportes, moraIndices);
  }, [aportes, moraIndices]);

  return (
    <div className="h-screen w-screen bg-gray-100 relative overflow-hidden">
      {/* Full Page Hexagonal Grid - covers entire viewport */}
      <HexagonCanvas 
        aportes={aportes}
        moraIndices={moraIndices}
        dimensions={dimensions}
        onHexagonClick={setSelectedStudentIndex}
      />

      {/* Stats Section */}
      <StatsBar stats={stats} />

      {/* Bottom Toolbar - Absolute positioned at bottom */}
      <Toolbar 
        presupuestoTotal={presupuestoTotal}
        aportes={aportes}
        selectedStudentIndex={selectedStudentIndex}
        onAporteChange={handleAporteChange}
      />
    </div>
  );
}
