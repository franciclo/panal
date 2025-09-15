import { useRef, useEffect } from 'react';
import { drawHexagon, calculateHexagonGrid } from '../canvas-utils';
import { getPaymentColor } from '../color-utils';
import { COLORS, TOTAL_APORTES } from '../constants';
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
    const needsFullRedraw = 
      dimensions.width !== canvas.width / window.devicePixelRatio ||
      dimensions.height !== canvas.height / window.devicePixelRatio ||
      hexGridData.current.length === 0;

    if (needsFullRedraw) {
      // Setup canvas
      canvas.width = dimensions.width * window.devicePixelRatio;
      canvas.height = dimensions.height * window.devicePixelRatio;
      canvas.style.width = `${dimensions.width}px`;
      canvas.style.height = `${dimensions.height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Calculate hex size based on available space (considering toolbar and stats)
      const isMobile = dimensions.width < 640;
      const isTablet = dimensions.width < 768;
      
      // Calculate available space (same logic as calculateHexagonGrid)
      const statsTopPadding = isMobile ? 10 : 16;
      const statsContentHeight = isMobile ? 40 : 50;
      const toolbarBottomPadding = isMobile ? 16 : isTablet ? 24 : 32;
      const toolbarContentHeight = isMobile ? 60 : 80;
      
      const topPadding = statsTopPadding + statsContentHeight + 20;
      const bottomPadding = toolbarBottomPadding + toolbarContentHeight + 20;
      const availableHeight = dimensions.height - topPadding - bottomPadding;
      const availableWidth = dimensions.width - 40;
      
      const minDimension = Math.min(availableHeight, availableWidth);
      const blobRadius = Math.sqrt(TOTAL_APORTES / Math.PI);
      const maxHexSize = minDimension / (blobRadius * 3.4);
      const hexSize = Math.max(6, Math.min(35, maxHexSize));
      
      const { centerX, centerY, HEX_WIDTH, HEX_HEIGHT, viewportRadius } = calculateHexagonGrid(dimensions, hexSize);

      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      const newHexGridData: HexagonData[] = [];

      // First, render the full background grid covering entire canvas
      const backgroundRadius = Math.max(
        Math.ceil(dimensions.width / HEX_WIDTH),
        Math.ceil(dimensions.height / HEX_HEIGHT)
      ) + 2;

      for (let q = -backgroundRadius; q <= backgroundRadius; q++) {
        const r1 = Math.max(-backgroundRadius, -q - backgroundRadius);
        const r2 = Math.min(backgroundRadius, -q + backgroundRadius);

        for (let r = r1; r <= r2; r++) {
          const x = centerX + HEX_WIDTH * (q + r / 2);
          const y = centerY + HEX_HEIGHT * r;

          // Only render if hexagon is visible on screen
          if (x + hexSize >= 0 && x - hexSize <= dimensions.width && 
              y + hexSize >= 0 && y - hexSize <= dimensions.height) {
            drawHexagon(ctx, x, y, hexSize, COLORS.background, false);
          }
        }
      }

      // Collect and sort hexagons by distance from center for data overlay
      const hexagonPositions: Array<{x: number, y: number, q: number, r: number, distance: number}> = [];
      
      for (let q = -viewportRadius; q <= viewportRadius; q++) {
        const r1 = Math.max(-viewportRadius, -q - viewportRadius);
        const r2 = Math.min(viewportRadius, -q + viewportRadius);

        for (let r = r1; r <= r2; r++) {
          const x = centerX + HEX_WIDTH * (q + r / 2);
          const y = centerY + HEX_HEIGHT * r;

          if (x + hexSize < 0 || x - hexSize > dimensions.width || y + hexSize < 0 || y - hexSize > dimensions.height) {
            continue;
          }

          const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
          hexagonPositions.push({ x, y, q, r, distance: distanceFromCenter });
        }
      }

      // Sort by distance and take first TOTAL_APORTES
      hexagonPositions.sort((a, b) => a.distance - b.distance);
      const assignedHexagons = new Set(hexagonPositions.slice(0, TOTAL_APORTES).map(h => `${h.q},${h.r}`));

      // Render data hexagons on top of background
      let aporteIndex = 0;
      
      for (let q = -viewportRadius; q <= viewportRadius; q++) {
        const r1 = Math.max(-viewportRadius, -q - viewportRadius);
        const r2 = Math.min(viewportRadius, -q + viewportRadius);

        for (let r = r1; r <= r2; r++) {
          const x = centerX + HEX_WIDTH * (q + r / 2);
          const y = centerY + HEX_HEIGHT * r;

          if (x + hexSize < 0 || x - hexSize > dimensions.width || y + hexSize < 0 || y - hexSize > dimensions.height) {
            continue;
          }

          const isAssigned = assignedHexagons.has(`${q},${r}`);
          let color: string = COLORS.background;
          let hasData = false;
          let aporteId = '';
          let familiaIndex = -1;

          if (isAssigned && aporteIndex < TOTAL_APORTES) {
            const aporte = allAportes[aporteIndex];
            if (aporte) {
              familiaIndex = aportes.findIndex(familiaAportes => familiaAportes.some(a => a.id === aporte.id));
              const isEnMora = moraIndices.includes(familiaIndex);
              
              color = isEnMora ? COLORS.mora : getPaymentColor(aporte.value);
              hasData = true;
              aporteId = aporte.id;
              aporteIndex++;
            }
          }

          newHexGridData.push({ x, y, size: hexSize, familiaIndex, aporteId, hasData });
          
          // Only draw data hexagons (background already drawn)
          if (hasData) {
            drawHexagon(ctx, x, y, hexSize, color, hasData);
          }
        }
      }
      
      console.log(`Success: ${aporteIndex} aportes painted in circular pattern.`);
      hexGridData.current = newHexGridData;
    } else {
      // Update only changed aportes
      const prevAportesFlat = prevAportes.current.flat();
      
      allAportes.forEach(currentAporte => {
        const prevAporte = prevAportesFlat.find(p => p.id === currentAporte.id);
        if (!prevAporte || prevAporte.value !== currentAporte.value) {
          const hexToUpdate = hexGridData.current.find(h => h.aporteId === currentAporte.id);
          if (hexToUpdate) {
            const familiaIndex = hexToUpdate.familiaIndex;
            const isEnMora = moraIndices.includes(familiaIndex);
            const newColor = isEnMora ? COLORS.mora : getPaymentColor(currentAporte.value);
            drawHexagon(ctx, hexToUpdate.x, hexToUpdate.y, hexToUpdate.size, newColor, true);
          }
        }
      });
    }
    
    prevAportes.current = aportes.map(studentAportes => studentAportes.map(a => ({...a})));
    
  }, [aportes, moraIndices, dimensions]);

  return { canvasRef };
}