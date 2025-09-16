// Format numbers with abbreviations
export function formatAbbreviated(num: number): string {
  const formatWithSuffix = (value: number, suffix: string) => {
    const fixed = value.toFixed(1);
    const trimmed = fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
    return trimmed + suffix;
  };

  if (num >= 1e9) return formatWithSuffix(num / 1e9, 'B');
  if (num >= 1e6) return formatWithSuffix(num / 1e6, 'M');
  if (num >= 1e3) return formatWithSuffix(num / 1e3, 'K');
  return num.toString();
}
