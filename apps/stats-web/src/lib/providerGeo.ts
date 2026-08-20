export type ProviderGeoRecord = {
  isOnline: boolean;
  ipLat: string | null;
  ipLon: string | null;
  ipCountryCode: string | null;
  uptime30d: number | null;
};

export type GlobeMarker = [number, number];

/** isOnline && has resolved, non-zero coordinates - the Stage 6 marker filter. */
export function filterOnlineProvidersWithCoords<T extends ProviderGeoRecord>(providers: T[]): T[] {
  return providers.filter(p => p.isOnline && !!p.ipLat && !!p.ipLon && parseFloat(p.ipLat) !== 0 && parseFloat(p.ipLon) !== 0);
}

export function toMarkers(providers: ProviderGeoRecord[]): GlobeMarker[] {
  return providers.map(p => [parseFloat(p.ipLat as string), parseFloat(p.ipLon as string)]);
}

export function countUniqueCountries(providers: ProviderGeoRecord[]): number {
  return new Set(providers.map(p => p.ipCountryCode).filter((code): code is string => !!code)).size;
}

export function countUSVsElsewhere(providers: ProviderGeoRecord[]): { usCount: number; elsewhereCount: number } {
  const usCount = providers.filter(p => p.ipCountryCode === "US").length;
  return { usCount, elsewhereCount: providers.length - usCount };
}

/** Used when a fetch never succeeded even once - a warm cache that goes stale on a failed refetch keeps its last-known-good markers instead. */
export function resolveGlobeMarkers(markers: GlobeMarker[], fallback: GlobeMarker[]): GlobeMarker[] {
  return markers.length > 0 ? markers : fallback;
}

export function medianUptime30d(providers: ProviderGeoRecord[]): number | null {
  const values = providers.map(p => p.uptime30d).filter((v): v is number => typeof v === "number");
  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}
