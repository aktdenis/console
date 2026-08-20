/**
 * Ported from akash-network/website src/components/home/NetworkGlobe.tsx -
 * keeping these identical is what keeps stats-web and the homepage consistent.
 */
export function fmtNum(n: number) {
  return n.toLocaleString("en-US");
}

export function fmtBytes(bytes: number): string {
  const PB = 1024 ** 5;
  const TB = 1024 ** 4;
  if (bytes >= PB) return `${(bytes / PB).toFixed(1)} PB`;
  return `${Math.round(bytes / TB)} TB`;
}

export function fmtCPU(millicores: number): string {
  const cores = millicores / 1_000;
  if (cores >= 1_000_000) return `${(cores / 1_000_000).toFixed(1)}M`;
  if (cores >= 1_000) return `${Math.round(cores / 1_000)}k`;
  return fmtNum(Math.round(cores));
}
