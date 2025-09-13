import { COLORS } from './constants';
import type { HexagonData } from './types';

// Helper to draw a hexagon on canvas
export function drawHexagon(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  size: number, 
  color: string, 
  hasData: boolean
) {
  const sqrt3_2 = size * Math.sqrt(3) / 2;
  const halfSize = size / 2;

  ctx.beginPath();
  ctx.moveTo(x + size, y);
  ctx.lineTo(x + halfSize, y - sqrt3_2);
  ctx.lineTo(x - halfSize, y - sqrt3_2);
  ctx.lineTo(x - size, y);
  ctx.lineTo(x - halfSize, y + sqrt3_2);
  ctx.lineTo(x + halfSize, y + sqrt3_2);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();

  ctx.strokeStyle = hasData ? color : COLORS.backgroundBorder;
  ctx.lineWidth = 1;
  ctx.stroke();
}

// Calculate hexagon grid layout
export function calculateHexagonGrid(dimensions: any, hexSize: number) {
  const centerX = dimensions.width / 2;
  const statsHeight = dimensions.width < 640 ? 50 : 60;
  const topPadding = dimensions.width < 640 ? 20 : 40;
  const availableHeight = dimensions.height - statsHeight - (dimensions.width < 640 ? 60 : 80) - topPadding - (dimensions.width < 640 ? 30 : 52);
  const centerY = statsHeight + topPadding + availableHeight / 2;

  const HEX_WIDTH = hexSize * 1.5;
  const HEX_HEIGHT = hexSize * Math.sqrt(3);

  const viewportRadius = Math.ceil(Math.max(dimensions.width / HEX_WIDTH, dimensions.height / HEX_HEIGHT)) + 2;

  return {
    centerX,
    centerY,
    HEX_WIDTH,
    HEX_HEIGHT,
    viewportRadius
  };
}
