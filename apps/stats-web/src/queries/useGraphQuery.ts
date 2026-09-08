import type { QueryKey, UseQueryOptions } from "@tanstack/react-query";
import { useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";

import { QueryKeys } from "./queryKeys";

import { ApiUrlService } from "@/lib/apiUtils";
import type { GraphResponse } from "@/types";

async function getGraphSnaphot(snapshot: string): Promise<GraphResponse> {
  const res = await axios.get(ApiUrlService.graphData(snapshot));
  return res.data;
}

/** Shared with useGraphSnapshots so a single metric fetched both on its own and as part of a comparison hits the same cache entry. */
function graphSnapshotQueryOptions(snapshot: string) {
  return { queryKey: QueryKeys.getGraphKey(snapshot), queryFn: () => getGraphSnaphot(snapshot) };
}

export function useGraphSnapshot(snapshot: string, options?: Omit<UseQueryOptions<GraphResponse, Error, GraphResponse, QueryKey>, "queryKey" | "queryFn">) {
  return useQuery({
    ...graphSnapshotQueryOptions(snapshot),
    ...options
  });
}

/** For a caller-chosen, dynamically-sized set of metrics (e.g. a comparison tool) - useQueries supports a variable query count without breaking the rules of hooks. */
export function useGraphSnapshots(snapshots: string[]) {
  return useQueries({ queries: snapshots.map(graphSnapshotQueryOptions) });
}

async function getProviderGraphSnaphot(snapshot: string): Promise<GraphResponse> {
  const res = await axios.get(ApiUrlService.providerGraphData(snapshot));
  return res.data;
}

export function useProviderGraphSnapshot(
  snapshot: string,
  options?: Omit<UseQueryOptions<GraphResponse, Error, GraphResponse, QueryKey>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: QueryKeys.getProviderGraphKey(snapshot),
    queryFn: () => getProviderGraphSnaphot(snapshot),
    ...options
  });
}
