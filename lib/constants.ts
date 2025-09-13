// Application constants
export const NUMBER_OF_FAMILIES = 300; // The number of families contributing
export const TOTAL_APORTES = 400;      // The total number of aportes (kids) to visualize
export const MORA_COUNT = 80;
export const STANDARD_PAYMENT = 500000;
export const MIN_PAYMENT = 100000;
export const MAX_PAYMENT = 1000000;
export const DATA_RADIUS = 12; // Increased from 11 to fit all 400 aportes

// Color constants
export const COLORS = {
  mora: 'hsl(15, 75%, 55%)',
  donaciones: 'hsl(217, 80%, 45%)',
  becas: 'hsl(142, 70%, 55%)',
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
