import { useCanvas } from '@/lib/hooks/useCanvas';
import type { Dimensions, Aporte } from '@/lib/types';

interface HexagonCanvasProps {
  aportes: Aporte[][];
  moraIndices: number[];
  dimensions: Dimensions;
}

export function HexagonCanvas({ aportes, moraIndices, dimensions }: HexagonCanvasProps) {
  const { canvasRef } = useCanvas({
    aportes,
    moraIndices,
    dimensions
  });

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full"
    />
  );
}
