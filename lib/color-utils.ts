import { MIN_PAYMENT, MAX_PAYMENT } from './constants';
import type { ColorStop } from './types';

// Color interpolation for payment values
export function getPaymentColor(value: number): string {
  const normalized = (value - MIN_PAYMENT) / (MAX_PAYMENT - MIN_PAYMENT);
  const clamped = Math.max(0, Math.min(1, normalized));
  
  const colorStops: ColorStop[] = [
    { h: 0, s: 0, l: 100 },      // White
    { h: 142, s: 20, l: 95 },    // Light mint
    { h: 142, s: 40, l: 85 },    // Medium mint
    { h: 142, s: 60, l: 70 },    // Rich mint
    { h: 200, s: 75, l: 50 },    // Teal-blue
    { h: 217, s: 80, l: 45 }     // Deep blue
  ];
  
  const stopIndex = clamped * (colorStops.length - 1);
  const lower = colorStops[Math.floor(stopIndex)];
  const upper = colorStops[Math.min(Math.floor(stopIndex) + 1, colorStops.length - 1)];
  const t = stopIndex - Math.floor(stopIndex);
  
  const h = Math.round(lower.h + (upper.h - lower.h) * t);
  const s = Math.round(lower.s + (upper.s - lower.s) * t);
  const l = Math.round(lower.l + (upper.l - lower.l) * t);
  
  return `hsl(${h}, ${s}%, ${l}%)`;
}
