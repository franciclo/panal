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
  // Draw outer hexagon (straight edges)
  const outerVertices = getHexagonVertices(x, y, size);
  ctx.beginPath();
  ctx.moveTo(outerVertices[0][0], outerVertices[0][1]);
  for (let i = 1; i < outerVertices.length; i++) {
    ctx.lineTo(outerVertices[i][0], outerVertices[i][1]);
  }
  ctx.closePath();
  
  // Fill outer hexagon with border color for data hexagons, background for empty ones
  ctx.fillStyle = hasData ? COLORS.border : COLORS.background;
  ctx.fill();

  // Draw inner hexagon (rounded corners)
  const innerSize = size * 0.9; // 90% of outer size
  const innerVertices = getHexagonVertices(x, y, innerSize);
  
  ctx.beginPath();
  for (let i = 0; i < innerVertices.length; i++) {
    const current = innerVertices[i];
    const next = innerVertices[(i + 1) % innerVertices.length];
    const prev = innerVertices[(i - 1 + innerVertices.length) % innerVertices.length];

    // Calculate corner radius
    const cornerRadius = Math.max(2, size * 0.15);
    
    // Calculate vectors for rounded corners
    const toPrev = [prev[0] - current[0], prev[1] - current[1]];
    const toNext = [next[0] - current[0], next[1] - current[1]];
    
    // Normalize vectors
    const toPrevLength = Math.sqrt(toPrev[0] ** 2 + toPrev[1] ** 2);
    const toNextLength = Math.sqrt(toNext[0] ** 2 + toNext[1] ** 2);
    
    toPrev[0] /= toPrevLength;
    toPrev[1] /= toPrevLength;
    toNext[0] /= toNextLength;
    toNext[1] /= toNextLength;
    
    // Calculate rounded corner points
    const cornerStart = [current[0] + toPrev[0] * cornerRadius, current[1] + toPrev[1] * cornerRadius];
    const cornerEnd = [current[0] + toNext[0] * cornerRadius, current[1] + toNext[1] * cornerRadius];
    
    if (i === 0) {
      ctx.moveTo(cornerStart[0], cornerStart[1]);
    } else {
      ctx.lineTo(cornerStart[0], cornerStart[1]);
    }
    
    // Draw rounded corner
    ctx.quadraticCurveTo(current[0], current[1], cornerEnd[0], cornerEnd[1]);
  }
  ctx.closePath();
  
  // Fill inner hexagon with the data color or background border
  ctx.fillStyle = hasData ? color : COLORS.backgroundBorder;
  ctx.fill();
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


export function calculateHexagonGrid(dimensions: any, hexSize: number) {
  const centerX = dimensions.width / 2;
  
  // Calculate vertical padding based on responsive breakpoints
  const isMobile = dimensions.width < 640;
  const isTablet = dimensions.width < 768;
  
  // Stats bar: top-2 sm:top-4 + content height
  const statsTopPadding = isMobile ? 8 : 16; // top-2 = 8px, sm:top-4 = 16px
  const statsContentHeight = isMobile ? 40 : 50; // Approximate content height
  
  // Toolbar: bottom-4 sm:bottom-6 md:bottom-8 + content height  
  const toolbarBottomPadding = isMobile ? 16 : isTablet ? 24 : 32; // bottom-4/6/8
  const toolbarContentHeight = isMobile ? 60 : 80; // Approximate content height
  
  // Calculate available vertical space
  const topPadding = statsTopPadding + statsContentHeight + 60; // Extra margin
  const bottomPadding = toolbarBottomPadding + toolbarContentHeight + 20; // Extra margin
  const availableHeight = dimensions.height - topPadding - bottomPadding;
  
  // Center the honeycomb in the available vertical space
  const centerY = topPadding + availableHeight / 2;
  
  const HEX_WIDTH = hexSize * Math.sqrt(3);
  const HEX_HEIGHT = hexSize * 1.5;
  
  // Calculate viewport radius based on available space
  const availableWidth = dimensions.width - 40; // Side padding
  const minDimension = Math.min(availableHeight, availableWidth);
  const viewportRadius = Math.ceil(minDimension / (hexSize * 2)) + 2;

  return {
    centerX,
    centerY,
    HEX_WIDTH,
    HEX_HEIGHT,
    viewportRadius
  };
}
