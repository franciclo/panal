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
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + sqrt3_2, y - halfSize);
  ctx.lineTo(x + sqrt3_2, y + halfSize);
  ctx.lineTo(x, y + size);
  ctx.lineTo(x - sqrt3_2, y + halfSize);
  ctx.lineTo(x - sqrt3_2, y - halfSize);
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

  const HEX_WIDTH = hexSize * Math.sqrt(3);
  const HEX_HEIGHT = hexSize * 1.5;

  const viewportRadius = Math.ceil(Math.max(dimensions.width / HEX_WIDTH, dimensions.height / HEX_HEIGHT)) + 2;

  return {
    centerX,
    centerY,
    HEX_WIDTH,
    HEX_HEIGHT,
    viewportRadius
  };
}

/**
 * Checks if a hexagon at a given axial coordinate is inside the main grid shape.
 * @param q - The q axial coordinate.
 * @param r - The r axial coordinate.
 * @param radius - The radius of the grid shape.
 * @returns True if the coordinate is inside the shape, false otherwise.
 */
export function isInGridShape(q: number, r: number, radius: number): boolean {
  const s = -q - r;

  if (Math.max(Math.abs(q), Math.abs(r), Math.abs(s)) > radius) {
    return false;
  }

  const cornerCutoff = Math.ceil(radius / 2);
  if (
    Math.abs(q - r) > radius + cornerCutoff ||
    Math.abs(r - s) > radius + cornerCutoff ||
    Math.abs(s - q) > radius + cornerCutoff
  ) {
    return false;
  }

  return true;
}
