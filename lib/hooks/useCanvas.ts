import { useRef, useEffect } from 'react';
import { drawHexagon, calculateHexagonGrid } from '../canvas-utils';
import { getPaymentColor } from '../color-utils';
import { COLORS, DATA_RADIUS, TOTAL_STUDENTS, STANDARD_PAYMENT } from '../constants';
import type { Dimensions, HexagonData } from '../types';

interface UseCanvasProps {
  aportes: number[];
  moraIndices: number[];
  dimensions: Dimensions;
}

export function useCanvas({ aportes, moraIndices, dimensions }: UseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hexGridData = useRef<HexagonData[]>([]);
  const prevAportes = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Full redraw when dimensions change or on initial render
    if (dimensions.width !== canvas.width / window.devicePixelRatio || dimensions.height !== canvas.height / window.devicePixelRatio) {
      // Scale canvas for high-DPI displays
      canvas.width = dimensions.width * window.devicePixelRatio;
      canvas.height = dimensions.height * window.devicePixelRatio;
      canvas.style.width = `${dimensions.width}px`;
      canvas.style.height = `${dimensions.height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Calculate available space
      const statsHeight = dimensions.width < 640 ? 50 : 60;
      const toolbarHeight = dimensions.width < 640 ? 60 : 80;
      const topPadding = dimensions.width < 640 ? 20 : 40;
      const bottomPadding = dimensions.width < 640 ? 30 : 52;
      const sidePadding = dimensions.width < 640 ? 20 : 40;
      
      const availableHeight = dimensions.height - statsHeight - toolbarHeight - topPadding - bottomPadding;
      const availableWidth = dimensions.width - (sidePadding * 2);
      
      // Calculate the total size of the hexagonal data cluster to determine max hex size
      const clusterHeightFactor = Math.sqrt(3) * (2 * DATA_RADIUS + 1);
      const clusterWidthFactor = (3 * DATA_RADIUS) + 2;

      const maxHexSizeByHeight = availableHeight / clusterHeightFactor;
      const maxHexSizeByWidth = availableWidth / clusterWidthFactor;
      
      const hexSize = Math.max(8, Math.min(35, maxHexSizeByHeight, maxHexSizeByWidth));
      
      const { centerX, centerY, HEX_WIDTH, HEX_HEIGHT, viewportRadius } = calculateHexagonGrid(dimensions, hexSize);

      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      const newHexGridData: HexagonData[] = [];
      let dataId = 0;

      // Calculate loop bounds based on viewport
      for (let q = -viewportRadius; q <= viewportRadius; q++) {
        const r1 = Math.max(-viewportRadius, -q - viewportRadius);
        const r2 = Math.min(viewportRadius, -q + viewportRadius);

        for (let r = r1; r <= r2; r++) {
          const x = centerX + HEX_WIDTH * q;
          const y = centerY + HEX_HEIGHT * (r + q / 2);

          // Viewport Culling: Skip drawing if hexagon is outside the visible area
          if (x + hexSize < 0 || x - hexSize > dimensions.width || y + hexSize < 0 || y - hexSize > dimensions.height) {
            continue;
          }

          const hexDistance = (Math.abs(q) + Math.abs(r) + Math.abs(-q - r)) / 2;
          const hasData = hexDistance <= DATA_RADIUS && dataId < TOTAL_STUDENTS;

          let color: string;
          if (hasData) {
            const isEnMora = moraIndices.includes(dataId);
            if (isEnMora) {
              color = COLORS.mora;
            } else {
              color = getPaymentColor(aportes[dataId] || STANDARD_PAYMENT);
            }
            newHexGridData.push({ x, y, size: hexSize, dataIndex: dataId, hasData });
            dataId++;
          } else {
            color = COLORS.background;
          }

          drawHexagon(ctx, x, y, hexSize, color, hasData);
        }
      }
      hexGridData.current = newHexGridData;
      prevAportes.current = aportes;
      return;
    }

    // Optimized redraw for aporte changes
    for (let i = 0; i < aportes.length; i++) {
      if (aportes[i] !== prevAportes.current[i]) {
        const hexToUpdate = hexGridData.current.find(hex => hex.dataIndex === i);
        if (hexToUpdate) {
          const newColor = getPaymentColor(aportes[i]);
          drawHexagon(ctx, hexToUpdate.x, hexToUpdate.y, hexToUpdate.size, newColor, true);
        }
      }
    }

    prevAportes.current = aportes;
  }, [aportes, moraIndices, dimensions]);

  return {
    canvasRef
  };
}
