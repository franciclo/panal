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
  // Calculate radii for outer and inner hexagons
  const outerRadius = size;
  const innerRadius = size * 0.9; // 90% of outer size for slimmer borders
  const cornerRadius = Math.max(3, size * 0.2); // 20% of size, minimum 3px

  // Draw outer hexagon with straight borders
  drawStraightHexagon(ctx, x, y, outerRadius, hasData, color);

  // Draw inner hexagon with rounded corners
  // Use grey color for background hexagons, original color for data hexagons
  const innerColor = hasData ? color : COLORS.backgroundBorder;
  drawRoundedHexagon(ctx, x, y, innerRadius, cornerRadius, innerColor);
}

function getHexagonVertices(centerX: number, centerY: number, radius: number): [number, number][] {
  const vertices: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 - Math.PI / 2; // Start from top
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    vertices.push([x, y]);
  }
  return vertices;
}

function drawStraightHexagon(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  hasData: boolean,
  color: string
) {
  const vertices = getHexagonVertices(centerX, centerY, radius);

  ctx.beginPath();
  ctx.moveTo(vertices[0][0], vertices[0][1]);

  for (let i = 1; i < vertices.length; i++) {
    ctx.lineTo(vertices[i][0], vertices[i][1]);
  }

  ctx.closePath();

  // Fill outer hexagon with lighter border color for colored aportes, background for empty ones
  ctx.fillStyle = hasData ? COLORS.border : COLORS.background;
  ctx.fill();

  // No stroke - outer hexagon has no border
}

function drawRoundedHexagon(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  cornerRadius: number,
  color: string
) {
  const vertices = getHexagonVertices(centerX, centerY, radius);

  ctx.beginPath();

  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    const prev = vertices[(i - 1 + vertices.length) % vertices.length];

    // Calculate vectors from current vertex to adjacent vertices
    const toPrev = [prev[0] - current[0], prev[1] - current[1]];
    const toNext = [next[0] - current[0], next[1] - current[1]];

    // Normalize vectors
    const toPrevLength = Math.sqrt(toPrev[0] ** 2 + toPrev[1] ** 2);
    const toNextLength = Math.sqrt(toNext[0] ** 2 + toNext[1] ** 2);

    toPrev[0] /= toPrevLength;
    toPrev[1] /= toPrevLength;
    toNext[0] /= toNextLength;
    toNext[1] /= toNextLength;

    // Calculate points for rounded corner
    const cornerStart = [current[0] + toPrev[0] * cornerRadius, current[1] + toPrev[1] * cornerRadius];
    const cornerEnd = [current[0] + toNext[0] * cornerRadius, current[1] + toNext[1] * cornerRadius];

    if (i === 0) {
      ctx.moveTo(cornerStart[0], cornerStart[1]);
    } else {
      ctx.lineTo(cornerStart[0], cornerStart[1]);
    }

    // Draw rounded corner using quadratic curve
    ctx.quadraticCurveTo(current[0], current[1], cornerEnd[0], cornerEnd[1]);
  }

  ctx.closePath();

  // Fill inner hexagon with the specified color
  ctx.fillStyle = color;
  ctx.fill();
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