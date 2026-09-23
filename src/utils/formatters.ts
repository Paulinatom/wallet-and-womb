export function formatKES(millions: number): string {
  if (millions >= 1000) {
    return `KES ${(millions / 1000).toFixed(2)}B`;
  }
  return `KES ${millions.toLocaleString()}M`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function generateVerificationHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const timestamp = Date.now().toString(16).slice(-6);
  return `WW-KE-${hex.toUpperCase()}-${timestamp.toUpperCase()}`;
}
