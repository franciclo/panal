import { useCanvas } from '@/lib/hooks/useCanvas';
import type { Dimensions } from '@/lib/types';

interface HexagonCanvasProps {
  aportes: number[];
  moraIndices: number[];
  dimensions: Dimensions;
  onHexagonClick: (dataIndex: number) => void;
}

export function HexagonCanvas({ aportes, moraIndices, dimensions, onHexagonClick }: HexagonCanvasProps) {
  const { canvasRef, handleCanvasClick } = useCanvas({
    aportes,
    moraIndices,
    dimensions,
    onHexagonClick
  });

  return (
    <canvas 
      ref={canvasRef} 
      onClick={handleCanvasClick}
      className="absolute inset-0 w-full h-full cursor-pointer"
    />
  );
}
