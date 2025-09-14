import { COLORS } from './constants';
import type { HexagonData } from './types';

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

export function calculateHexagonGrid(dimensions: any, hexSize: number) {
  const centerX = dimensions.width / 2;
  const statsHeight = dimensions.width < 640 ? 50 : 60;
  const toolbarHeight = dimensions.width < 640 ? 60 : 80;
  const topPadding = dimensions.width < 640 ? 20 : 40;
  const verticalPadding = dimensions.height * 0.08;
  const availableHeight = dimensions.height - statsHeight - toolbarHeight - topPadding - (verticalPadding * 2);
  
  // Center the circular shape in the available vertical space
  const centerY = statsHeight + topPadding + verticalPadding + availableHeight / 2;

  const HEX_WIDTH = hexSize * Math.sqrt(3);
  const HEX_HEIGHT = hexSize * 1.5;
  
  // Calculate maximum radius that fits within available space
  const sidePadding = dimensions.width < 640 ? 15 : 25;
  const availableWidth = dimensions.width - (sidePadding * 2);
  const minDimension = Math.min(availableHeight, availableWidth);
  
  // Calculate viewport radius based on available space
  const maxRadiusBySpace = Math.floor(minDimension / (hexSize * 2));
  const viewportRadius = Math.max(maxRadiusBySpace, Math.ceil(Math.max(dimensions.width / HEX_WIDTH, dimensions.height / HEX_HEIGHT)) + 2);

  return {
    centerX,
    centerY,
    HEX_WIDTH,
    HEX_HEIGHT,
    viewportRadius
  };
}

// Note: generateCircularPositions removed - using direct distance-based sorting