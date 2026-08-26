import { type GpuModelInfo, type ProviderGeoRecord } from "@/lib/providerGeo";

export type ConstellationNode = {
  owner: string;
  name: string;
  region: string;
  gpuModels: GpuModelInfo[];
  uptime30d: number | null;
  hasActiveDeployments: boolean;
};

function providerDisplayName(hostUri: string): string {
  try {
    return new URL(hostUri).hostname;
  } catch {
    return hostUri;
  }
}

function providerRegionLabel(provider: ProviderGeoRecord): string {
  return [provider.ipRegion, provider.ipCountryCode].filter(Boolean).join(", ") || "Unknown region";
}

export function buildConstellationNodes(providers: ProviderGeoRecord[]): ConstellationNode[] {
  return providers
    .filter(provider => provider.isOnline)
    .map(provider => ({
      owner: provider.owner,
      name: providerDisplayName(provider.hostUri),
      region: providerRegionLabel(provider),
      gpuModels: provider.gpuModels,
      uptime30d: provider.uptime30d,
      hasActiveDeployments: provider.stats.cpu.active > 0
    }));
}
