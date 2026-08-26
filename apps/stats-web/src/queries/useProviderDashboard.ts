import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { QueryKeys } from "./queryKeys";

import { ApiUrlService } from "@/lib/apiUtils";

export type ProviderDashboardSnapshot = {
  date: string;
  height: number;
  activeLeaseCount: number;
  totalLeaseCount: number;
  activeCPU: number;
  activeGPU: number;
  activeMemory: string;
  activeEphemeralStorage: string;
  activePersistentStorage: string;
};

export type ProviderDashboardResponse = {
  current: ProviderDashboardSnapshot;
  previous: ProviderDashboardSnapshot;
};

async function getProviderDashboard(owner: string): Promise<ProviderDashboardResponse> {
  const res = await axios.get(ApiUrlService.providerDashboard(owner));
  return res.data;
}

/** Fetched lazily per hovered/selected provider rather than for the whole roster upfront - only enabled once an owner is picked. */
export function useProviderDashboard(owner: string | null) {
  return useQuery({
    queryKey: QueryKeys.getProviderDashboardKey(owner ?? ""),
    queryFn: () => getProviderDashboard(owner as string),
    enabled: owner !== null,
    staleTime: 60 * 1000
  });
}
