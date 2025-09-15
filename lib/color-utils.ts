import { MIN_PAYMENT, MAX_PAYMENT } from './constants';
import type { ColorStop } from './types';

// Color interpolation for payment values
export function getPaymentColor(value: number): string {
  const normalized = (value - MIN_PAYMENT) / (MAX_PAYMENT - MIN_PAYMENT);
  const clamped = Math.max(0, Math.min(1, normalized));
  
  const colorStops: ColorStop[] = [
    { h: 40, s: 85, l: 84 },     // Peach - very light honey (#F9E2B3)
    { h: 40, s: 90, l: 80 },     // Light peach-gold transition
    { h: 43, s: 99, l: 68 },     // Sunglow - bright golden yellow (#FED15F)
    { h: 43, s: 99, l: 68 },     // Sunglow extended - more yellow in middle range
    { h: 41, s: 95, l: 53 },     // Xanthous - deep golden yellow (#F9B214)
    { h: 27, s: 78, l: 61 },     // Persian orange - rich orange (#E9944F)
    { h: 21, s: 86, l: 42 },     // Syracuse red-orange - deep amber (#C5500F)
    { h: 35, s: 90, l: 38 },     // Dark golden brown (#BF7802)
    { h: 30, s: 85, l: 35 }      // Deep orange-brown (#C05C06)
  ];
  
  const stopIndex = clamped * (colorStops.length - 1);
  const lower = colorStops[Math.floor(stopIndex)];
  const upper = colorStops[Math.min(Math.floor(stopIndex) + 1, colorStops.length - 1)];
  const t = stopIndex - Math.floor(stopIndex);
  
  // Handle hue interpolation more carefully to avoid greyish colors
  let h: number;
  const hueDiff = upper.h - lower.h;
  if (Math.abs(hueDiff) > 180) {
    // Handle wraparound case (e.g., 350° to 10°)
    h = lower.h + (hueDiff > 0 ? hueDiff - 360 : hueDiff + 360) * t;
    if (h < 0) h += 360;
    if (h >= 360) h -= 360;
  } else {
    h = lower.h + hueDiff * t;
  }
  
  // Ensure saturation stays high to prevent muddy colors
  const s = Math.max(78, Math.round(lower.s + (upper.s - lower.s) * t));
  const l = Math.round(lower.l + (upper.l - lower.l) * t);
  
  return `hsl(${h}, ${s}%, ${l}%)`;
}
