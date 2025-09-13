// Application constants
export const TOTAL_STUDENTS = 400;
export const MORA_COUNT = 80;
export const STANDARD_PAYMENT = 500000;
export const MIN_PAYMENT = 100000;
export const MAX_PAYMENT = 1000000;
export const DATA_RADIUS = 11;

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
