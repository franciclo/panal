// Application constants
export const NUMBER_OF_FAMILIES = 300; // The number of families contributing
export const TOTAL_APORTES = 400;      // The total number of aportes (kids) to visualize
export const MORA_COUNT = 40;
export const BUDGET = 200000000;
export const STANDARD_PAYMENT = BUDGET / TOTAL_APORTES;
export const MIN_PAYMENT = 100000;
export const MAX_PAYMENT = 1000000;

// Calculate the required radius for the hexagonal grid based on TOTAL_APORTES
// Formula: 3r² + 3r + 1 = TOTAL_APORTES
// Solving for r: r = (-3 + sqrt(9 + 12(TOTAL_APORTES - 1))) / 6
export const DATA_RADIUS = Math.ceil((-3 + Math.sqrt(9 + 12 * (TOTAL_APORTES - 1))) / 6);

// Color constants - Honeycomb theme (updated with new palette)
export const COLORS = {
  mora: 'hsl(52, 50%, 14%)',        // #312f17 - Dark honeycomb (increased saturation)
  donaciones: 'hsl(35, 90%, 38%)',  // Dark golden brown (#BF7802) - deep orange brown
  becas: 'hsl(40, 85%, 84%)',       // Peach (#F9E2B3) - lightest honeycomb color
  border: 'hsl(50, 85%, 75%)',      // #e5bd3f - Lightest honeycomb for borders
  background: 'hsl(0, 0%, 98%)',
  backgroundBorder: 'hsl(0, 0%, 95%)',
  empty: 'hsl(0, 0%, 95%)'
} as const;

// Canvas configuration
export const CANVAS_CONFIG = {
  minHexSize: 8,
  maxHexSize: 35,
  devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1
} as const;
