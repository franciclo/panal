import { COLORS, TOTAL_APORTES } from './constants';
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
  const verticalPadding = dimensions.height * 0.05; // Match the padding from useCanvas
  const availableHeight = dimensions.height - statsHeight - toolbarHeight - topPadding - (verticalPadding * 2);
  const centerY = statsHeight + topPadding + verticalPadding + availableHeight / 2;

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

let cachedShape: Array<{q: number, r: number}> | null = null;
let cachedShapeSet: Set<string> | null = null;

function isInStarShape(q: number, r: number, radius: number): boolean {
  const s = -q - r;
  
  if (Math.max(Math.abs(q), Math.abs(r), Math.abs(s)) > radius) {
    return false;
  }
  
  const cornerCutoff = Math.ceil(radius / 2);
  return !(
    Math.abs(q - r) > radius + cornerCutoff ||
    Math.abs(r - s) > radius + cornerCutoff ||
    Math.abs(s - q) > radius + cornerCutoff
  );
}

function generateCenterOutwardHexagons(targetCount: number): Array<{q: number, r: number}> {
  // Start with a reasonable radius and increase until we have enough hexagons
  let radius = Math.ceil((-3 + Math.sqrt(9 + 12 * (targetCount - 1))) / 6);
  let validHexagons: Array<{q: number, r: number, distance: number}> = [];
  
  while (validHexagons.length < targetCount) {
    validHexagons = [];
    const viewportRadius = radius + 2;
    
    for (let q = -viewportRadius; q <= viewportRadius; q++) {
      const r1 = Math.max(-viewportRadius, -q - viewportRadius);
      const r2 = Math.min(viewportRadius, -q + viewportRadius);
      
      for (let r = r1; r <= r2; r++) {
        if (isInStarShape(q, r, radius)) {
          const distance = Math.sqrt(q * q + r * r + q * r);
          validHexagons.push({q, r, distance});
        }
      }
    }
    
    if (validHexagons.length < targetCount) {
      radius++;
    }
  }
  
  // Sort by distance from center, then by angle for symmetry
  validHexagons.sort((a, b) => {
    if (Math.abs(a.distance - b.distance) < 0.1) {
      const angleA = Math.atan2(a.r, a.q);
      const angleB = Math.atan2(b.r, b.q);
      return angleA - angleB;
    }
    return a.distance - b.distance;
  });
  
  return validHexagons.slice(0, targetCount).map(h => ({q: h.q, r: h.r}));
}

export function getOptimalShape(targetCount: number) {
  if (!cachedShape) {
    cachedShape = generateCenterOutwardHexagons(targetCount);
    cachedShapeSet = new Set(cachedShape.map(h => `${h.q},${h.r}`));
    console.log(`Center-outward shape: ${cachedShape.length} hexagons for ${targetCount} aportes`);
  }
  
  return cachedShape;
}

export function isInGridShape(q: number, r: number, radius: number): boolean {
  getOptimalShape(TOTAL_APORTES); // Ensure cache is populated
  return cachedShapeSet!.has(`${q},${r}`);
}
