import { MIN_PAYMENT, MAX_PAYMENT } from './constants';
import type { ColorStop } from './types';

// Color interpolation for payment values
export function getPaymentColor(value: number): string {
  const normalized = (value - MIN_PAYMENT) / (MAX_PAYMENT - MIN_PAYMENT);
  const clamped = Math.max(0, Math.min(1, normalized));
  
  const colorStops: ColorStop[] = [
    { h: 50, s: 20, l: 95 },     // Very light honey (instead of white)
    { h: 50, s: 40, l: 85 },     // Light honey
    { h: 50, s: 60, l: 75 },     // Medium honey
    { h: 50, s: 85, l: 61 },     // #eec33d - Standard payment (center at ~44% of range)
    { h: 45, s: 85, l: 59 },     // #ea9d3e - Orange honeycomb
    { h: 40, s: 85, l: 55 }      // Darker orange for highest payments
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
  
  const s = Math.round(lower.s + (upper.s - lower.s) * t);
  const l = Math.round(lower.l + (upper.l - lower.l) * t);
  
  return `hsl(${h}, ${s}%, ${l}%)`;
}
