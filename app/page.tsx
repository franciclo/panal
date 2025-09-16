'use client';

import { useMemo, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef);

  const presupuestoTotal = aportes.flat().reduce((sum, aporte) => sum + aporte.value, 0);

  const stats = useMemo(() => {
    return calculatePaymentStats(aportes, moraIndices);
  }, [aportes, moraIndices]);

  return (
    <div className="fixed inset-0 bg-gray-100">
      <div
        id="framed-container"
        ref={containerRef}
        className="relative overflow-hidden w-full h-[100dvh] m-0 bg-transparent border-0 rounded-none shadow-none
        lg:mx-auto lg:bg-white lg:border lg:border-gray-200 lg:rounded-2xl lg:shadow-sm lg:w-[calc(100%-2rem)] lg:max-w-[1200px] lg:mt-8 lg:mb-8 lg:h-[calc(100dvh-64px)]"
      >
        {/* Hexagonal Grid - fills the framed container */}
        <HexagonCanvas 
          aportes={aportes}
          moraIndices={moraIndices}
          dimensions={dimensions}
        />

        {/* Stats inside the framed container */}
        <StatsBar stats={stats} />

        {/* Toolbar inside container on large screens; still fixed on small */}
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
    </div>
  );
}
