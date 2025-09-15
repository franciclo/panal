'use client';

import { useMemo } from 'react';
import { useFamiliaData } from '@/lib/hooks/useFamiliaData';
import { useDimensions } from '@/lib/hooks/useDimensions';
import { calculatePaymentStats } from '@/lib/data-utils';
import { StatsBar } from '@/components/StatsBar';
import { Toolbar } from '@/components/Toolbar';
import { HexagonCanvas } from '@/components/HexagonCanvas';

export default function Home() {
  const { 
    aportes, 
    moraIndices, 
    designatedFamiliaIndex, 
    handleAporteChange, 
    getFamiliaAportesSum, 
    getFamiliaStandardBaseline,
    getFamiliaPercentageFromStandard
  } = useFamiliaData();
  const dimensions = useDimensions();

  const presupuestoTotal = aportes.flat().reduce((sum, aporte) => sum + aporte.value, 0);

  const stats = useMemo(() => {
    return calculatePaymentStats(aportes, moraIndices);
  }, [aportes, moraIndices]);

  return (
    <div className="h-screen w-screen bg-gray-100 relative overflow-hidden" style={{height: '100dvh'}}>
      {/* Full Page Hexagonal Grid - covers entire viewport */}
      <HexagonCanvas 
        aportes={aportes}
        moraIndices={moraIndices}
        dimensions={dimensions}
      />

      {/* Stats Section */}
      <StatsBar stats={stats} />

      {/* Bottom Toolbar - Absolute positioned at bottom */}
      <Toolbar 
        presupuestoTotal={presupuestoTotal}
        aportes={aportes}
        designatedFamiliaIndex={designatedFamiliaIndex}
        onAporteChange={handleAporteChange}
        getFamiliaAportesSum={getFamiliaAportesSum}
        getFamiliaStandardBaseline={getFamiliaStandardBaseline}
        getFamiliaPercentageFromStandard={getFamiliaPercentageFromStandard}
      />
    </div>
  );
}
