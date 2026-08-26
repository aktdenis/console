import { describe, expect, it } from "vitest";

import type { ProviderGeoRecord } from "@/lib/providerGeo";
import {
  countUniqueCountries,
  countUSVsElsewhere,
  filterOnlineProvidersWithCoords,
  medianUptime30d,
  resolveGlobeMarkers,
  selectFeaturedProviders,
  toMarkers
} from "@/lib/providerGeo";

function provider(overrides: Partial<ProviderGeoRecord>): ProviderGeoRecord {
  return {
    owner: "akash1owner",
    hostUri: "https://provider.example.com:8443",
    isOnline: true,
    isAudited: true,
    ipLat: "37.4316",
    ipLon: "-78.6569",
    ipRegion: "Virginia",
    ipCountry: "United States",
    ipCountryCode: "US",
    uptime30d: 0.999,
    gpuModels: [{ vendor: "nvidia", model: "h100", ram: "80Gi", interface: "SXM5" }],
    stats: { cpu: { active: 0 } },
    ...overrides
  };
}

describe(filterOnlineProvidersWithCoords.name, () => {
  it("excludes offline providers", () => {
    const providers = [provider({ isOnline: false })];
    expect(filterOnlineProvidersWithCoords(providers)).toHaveLength(0);
  });

  it("excludes providers with missing coordinates", () => {
    const providers = [provider({ ipLat: null }), provider({ ipLon: null })];
    expect(filterOnlineProvidersWithCoords(providers)).toHaveLength(0);
  });

  it("excludes providers whose coordinates are exactly zero", () => {
    const providers = [provider({ ipLat: "0", ipLon: "0" })];
    expect(filterOnlineProvidersWithCoords(providers)).toHaveLength(0);
  });

  it("keeps online providers with valid non-zero coordinates", () => {
    const providers = [provider({})];
    expect(filterOnlineProvidersWithCoords(providers)).toHaveLength(1);
  });
});

describe(toMarkers.name, () => {
  it("maps to [lat, lon] number pairs", () => {
    const providers = [provider({ ipLat: "1.5", ipLon: "-2.5" })];
    expect(toMarkers(providers)).toEqual([[1.5, -2.5]]);
  });
});

describe(countUniqueCountries.name, () => {
  it("counts distinct country codes, ignoring missing ones", () => {
    const providers = [
      provider({ ipCountryCode: "US" }),
      provider({ ipCountryCode: "US" }),
      provider({ ipCountryCode: "DE" }),
      provider({ ipCountryCode: null })
    ];
    expect(countUniqueCountries(providers)).toBe(2);
  });
});

describe(countUSVsElsewhere.name, () => {
  it("splits providers into US versus every other country", () => {
    const providers = [provider({ ipCountryCode: "US" }), provider({ ipCountryCode: "US" }), provider({ ipCountryCode: "DE" })];
    expect(countUSVsElsewhere(providers)).toEqual({ usCount: 2, elsewhereCount: 1 });
  });
});

describe(resolveGlobeMarkers.name, () => {
  it("uses the real markers when at least one is available", () => {
    const real: [number, number][] = [[1, 2]];
    const fallback: [number, number][] = [[3, 4]];
    expect(resolveGlobeMarkers(real, fallback)).toBe(real);
  });

  it("falls back to the placeholder set when there are no real markers - e.g. the first-ever fetch never succeeded", () => {
    const fallback: [number, number][] = [[3, 4]];
    expect(resolveGlobeMarkers([], fallback)).toBe(fallback);
  });
});

describe(medianUptime30d.name, () => {
  it("returns null when there is no data", () => {
    expect(medianUptime30d([])).toBeNull();
  });

  it("averages the two middle values for an even-sized set", () => {
    const providers = [provider({ uptime30d: 0.8 }), provider({ uptime30d: 0.9 }), provider({ uptime30d: 1.0 }), provider({ uptime30d: 0.7 })];
    expect(medianUptime30d(providers)).toBeCloseTo(0.85, 10);
  });

  it("returns the middle value for an odd-sized set", () => {
    const providers = [provider({ uptime30d: 0.5 }), provider({ uptime30d: 0.9 }), provider({ uptime30d: 0.7 })];
    expect(medianUptime30d(providers)).toBe(0.7);
  });
});

describe(selectFeaturedProviders.name, () => {
  it("excludes providers that are offline, unaudited, or have no GPUs", () => {
    const providers = [
      provider({ owner: "offline", isOnline: false }),
      provider({ owner: "unaudited", isAudited: false }),
      provider({ owner: "no-gpu", gpuModels: [] }),
      provider({ owner: "eligible" })
    ];

    const result = selectFeaturedProviders(providers, 10);

    expect(result.map(p => p.owner)).toEqual(["eligible"]);
  });

  it("orders by uptime descending and caps to the requested count", () => {
    const providers = [provider({ owner: "low", uptime30d: 0.5 }), provider({ owner: "high", uptime30d: 0.99 }), provider({ owner: "mid", uptime30d: 0.8 })];

    const result = selectFeaturedProviders(providers, 2);

    expect(result.map(p => p.owner)).toEqual(["high", "mid"]);
  });

  it("derives a display name from the provider's host URI and formats the region", () => {
    const providers = [provider({ hostUri: "https://provider.ams1p0.mainnet.akashian.io:8443", ipRegion: "Amsterdam", ipCountryCode: "NL" })];

    const [result] = selectFeaturedProviders(providers, 1);

    expect(result.name).toBe("provider.ams1p0.mainnet.akashian.io");
    expect(result.region).toBe("Amsterdam, NL");
  });

  it("falls back to a placeholder region when location data is missing", () => {
    const providers = [provider({ ipRegion: null, ipCountryCode: null })];

    const [result] = selectFeaturedProviders(providers, 1);

    expect(result.region).toBe("Unknown region");
  });
});
