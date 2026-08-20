import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { QueryKeys } from "./queryKeys";

import { ApiUrlService } from "@/lib/apiUtils";
import type { ProviderGeoRecord } from "@/lib/providerGeo";

async function getProviders(): Promise<ProviderGeoRecord[]> {
  const res = await axios.get(ApiUrlService.providers());
  return res.data;
}

/**
 * Provider locations barely change day to day (they're physical hosting sites), so this
 * is cached longer than the dashboard's own now/compare data.
 */
export function useProviders() {
  return useQuery({
    queryKey: QueryKeys.getProvidersKey(),
    queryFn: getProviders,
    staleTime: 5 * 60 * 1000
  });
}
