// Application constants
export const NUMBER_OF_FAMILIES = 300; // The number of families contributing
export const TOTAL_APORTES = 400;      // The total number of aportes (kids) to visualize
export const MORA_COUNT = 60;
export const BUDGET = 200000000;
export const STANDARD_PAYMENT = BUDGET / TOTAL_APORTES;
export const MIN_PAYMENT = 100000;
export const MAX_PAYMENT = 1000000;

// Honeycomb sizing caps
export const MIN_HEX_SIZE = 6;
export const MAX_HEX_SIZE = 20; // further reduce to make the maximum honeycomb smaller

// Balance scenario control
// Positive values = surplus, negative values = deficit, 0 = balanced
export const BALANCE_SCENARIO = -10000000; // Change this to test different scenarios


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

