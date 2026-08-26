import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { QueryKeys } from "./queryKeys";

import { ApiUrlService } from "@/lib/apiUtils";

export type GpuPriceModel = {
  vendor: string;
  model: string;
  ram: string;
  interface: string;
  availability: { total: number; available: number };
  price: { currency: string; min: number; max: number; avg: number; weightedAverage: number; med: number } | null;
};

export type GpuPricesResponse = {
  availability: { total: number; available: number };
  models: GpuPriceModel[];
};

async function getGpuPrices(): Promise<GpuPricesResponse> {
  const res = await axios.get(ApiUrlService.gpuPrices());
  return res.data;
}

/** Prices are derived from recent on-chain bids server-side, so they move slowly - cached like provider locations. */
export function useGpuPrices() {
  return useQuery({
    queryKey: QueryKeys.getGpuPricesKey(),
    queryFn: getGpuPrices,
    staleTime: 5 * 60 * 1000
  });
}
