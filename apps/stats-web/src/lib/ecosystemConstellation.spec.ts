import { describe, expect, it } from "vitest";

import { buildConstellationNodes } from "@/lib/ecosystemConstellation";
import type { ProviderGeoRecord } from "@/lib/providerGeo";

describe(buildConstellationNodes.name, () => {
  it("drops offline providers", () => {
    const nodes = buildConstellationNodes([provider({ owner: "online", isOnline: true }), provider({ owner: "offline", isOnline: false })]);

    expect(nodes.map(n => n.owner)).toEqual(["online"]);
  });

  it("derives the display name from the host URI and the region from ip region and country code", () => {
    const [node] = buildConstellationNodes([provider({ owner: "a", hostUri: "https://provider.example.com:8443", ipRegion: "Iowa", ipCountryCode: "US" })]);

    expect(node.name).toBe("provider.example.com");
    expect(node.region).toBe("Iowa, US");
  });

  it("falls back to the raw host URI when it fails to parse, and to 'Unknown region' when region and country are both missing", () => {
    const [node] = buildConstellationNodes([provider({ owner: "a", hostUri: "not-a-url", ipRegion: null, ipCountryCode: null })]);

    expect(node.name).toBe("not-a-url");
    expect(node.region).toBe("Unknown region");
  });

  it("returns an empty array when no providers are online", () => {
    expect(buildConstellationNodes([provider({ owner: "a", isOnline: false })])).toEqual([]);
  });

  it("derives hasActiveDeployments from active cpu usage", () => {
    const nodes = buildConstellationNodes([
      provider({ owner: "busy", stats: { cpu: { active: 1000 } } }),
      provider({ owner: "idle", stats: { cpu: { active: 0 } } })
    ]);

    expect(nodes.find(n => n.owner === "busy")?.hasActiveDeployments).toBe(true);
    expect(nodes.find(n => n.owner === "idle")?.hasActiveDeployments).toBe(false);
  });
});

function provider(overrides: Partial<ProviderGeoRecord> & { owner: string }): ProviderGeoRecord {
  return {
    hostUri: `https://${overrides.owner}.example.com`,
    isOnline: true,
    isAudited: true,
    ipLat: "10",
    ipLon: "10",
    ipRegion: "Region",
    ipCountry: "Country",
    ipCountryCode: "XX",
    uptime30d: 99,
    gpuModels: [],
    stats: { cpu: { active: 0 } },
    ...overrides
  };
}
