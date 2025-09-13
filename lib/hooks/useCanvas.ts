import { useRef, useEffect } from 'react';
import { drawHexagon, calculateHexagonGrid, isInGridShape } from '../canvas-utils';
import { getPaymentColor } from '../color-utils';
import { COLORS, DATA_RADIUS, STANDARD_PAYMENT } from '../constants';
import type { Dimensions, HexagonData, Aporte } from '../types';

interface UseCanvasProps {
  aportes: Aporte[][];
  moraIndices: number[];
  dimensions: Dimensions;
}

export function useCanvas({ aportes, moraIndices, dimensions }: UseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hexGridData = useRef<HexagonData[]>([]);
  const prevAportes = useRef<Aporte[][]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const allAportes = aportes.flat();
    const TOTAL_APORTES = allAportes.length;

    const needsFullRedraw = 
      dimensions.width !== canvas.width / window.devicePixelRatio ||
      dimensions.height !== canvas.height / window.devicePixelRatio ||
      hexGridData.current.length === 0; // Redraw if grid is empty

    if (needsFullRedraw) {
      canvas.width = dimensions.width * window.devicePixelRatio;
      canvas.height = dimensions.height * window.devicePixelRatio;
      canvas.style.width = `${dimensions.width}px`;
      canvas.style.height = `${dimensions.height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // --- Responsive Layout Calculation ---
      const statsHeight = dimensions.width < 640 ? 50 : 60;
      const toolbarHeight = dimensions.width < 640 ? 60 : 80;
      const sidePadding = dimensions.width < 640 ? 5 : 10;   // Minimal padding to allow wider grid
      
      // Add more vertical padding to prevent overlap
      const verticalPadding = dimensions.height * 0.05; // Use 5% of total height for top/bottom padding
      
      const availableHeight = dimensions.height - statsHeight - toolbarHeight - (verticalPadding * 2);
      const availableWidth = dimensions.width - (sidePadding * 2);
      
      const clusterHeightFactor = (3 * DATA_RADIUS) + 2;
      const clusterWidthFactor = Math.sqrt(3) * (2 * DATA_RADIUS + 1);

      const maxHexSizeByHeight = availableHeight / clusterHeightFactor;
      const maxHexSizeByWidth = availableWidth / clusterWidthFactor;
      
      // Use the maximum possible size that fits both constraints, prioritizing width
      const hexSize = Math.max(8, Math.min(45, Math.min(maxHexSizeByHeight, maxHexSizeByWidth * 1.2)));
      
      const { centerX, centerY, HEX_WIDTH, HEX_HEIGHT, viewportRadius } = calculateHexagonGrid(dimensions, hexSize);

      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      const newHexGridData: HexagonData[] = [];
      let aporteIdCounter = 0;

      for (let q = -viewportRadius; q <= viewportRadius; q++) {
        const r1 = Math.max(-viewportRadius, -q - viewportRadius);
        const r2 = Math.min(viewportRadius, -q + viewportRadius);

        for (let r = r1; r <= r2; r++) {
          const x = centerX + HEX_WIDTH * (q + r / 2);
          const y = centerY + HEX_HEIGHT * r;

          if (x + hexSize < 0 || x - hexSize > dimensions.width || y + hexSize < 0 || y - hexSize > dimensions.height) {
            continue;
          }

          const isInShape = isInGridShape(q, r, DATA_RADIUS);
          const hasData = isInShape && aporteIdCounter < TOTAL_APORTES;

          let color: string;
          if (hasData) {
            const familiaIndex = aportes.findIndex(familiaAportes => familiaAportes.some(a => a.id === allAportes[aporteIdCounter].id));
            const isEnMora = moraIndices.includes(familiaIndex);
            
            color = isEnMora ? COLORS.mora : getPaymentColor(allAportes[aporteIdCounter].value);

            newHexGridData.push({ 
              x, y, size: hexSize, 
              familiaIndex: familiaIndex,
              aporteId: allAportes[aporteIdCounter].id,
              hasData 
            });
            
            aporteIdCounter++;
          } else {
            // Render the star outline with a different background color
            color = isInShape ? COLORS.backgroundBorder : COLORS.background;
          }
          drawHexagon(ctx, x, y, hexSize, color, hasData);
        }
      }
      hexGridData.current = newHexGridData;
    } else {
        // Find changed aportes by comparing values, since IDs are stable
        const prevAportesFlat = prevAportes.current.flat();
        
        const changedAportes = allAportes.filter(currentAporte => {
            const prevAporte = prevAportesFlat.find(p => p.id === currentAporte.id);
            return !prevAporte || prevAporte.value !== currentAporte.value;
        });

        changedAportes.forEach((changedAporte) => {
            const hexToUpdate = hexGridData.current.find(h => h.aporteId === changedAporte.id);
            if (hexToUpdate) {
                const familiaIndex = hexToUpdate.familiaIndex;
                const isEnMora = moraIndices.includes(familiaIndex);
                const newColor = isEnMora ? COLORS.mora : getPaymentColor(changedAporte.value);
                drawHexagon(ctx, hexToUpdate.x, hexToUpdate.y, hexToUpdate.size, newColor, true);
            }
        });
    }
    
    prevAportes.current = aportes.map(studentAportes => studentAportes.map(a => ({...a})));
    
  }, [aportes, moraIndices, dimensions]);

  return {
    canvasRef
  };
}
