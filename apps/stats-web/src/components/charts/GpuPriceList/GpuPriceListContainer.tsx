"use client";
import type { FC } from "react";
import { Spinner } from "@akashnetwork/ui/components";

import { formatGpuModelName, parseRamGiB } from "@/components/charts/GpuPriceList/gpuModelLabels";
import { GpuPriceList, type GpuPriceRow } from "@/components/charts/GpuPriceList/GpuPriceList";
import { useGpuPrices } from "@/queries";

const DISPLAYED_MODEL_COUNT = 14;

export const GpuPriceListContainer: FC = () => {
  const { data, status } = useGpuPrices();

  if (status === "pending") {
    return (
      <div className="flex min-h-[160px] items-center justify-center rounded-xl border">
        <Spinner size="large" />
      </div>
    );
  }

  if (status === "error" || !data) return null;

  const rows: GpuPriceRow[] = data.models
    .filter(model => model.availability.total > 0)
    // Same order as akash.network/pricing/gpus: highest VRAM tier first, highest price within a tier first.
    .sort((a, b) => parseRamGiB(b.ram) - parseRamGiB(a.ram) || (b.price?.avg ?? 0) - (a.price?.avg ?? 0))
    .slice(0, DISPLAYED_MODEL_COUNT)
    .map(model => {
      const used = model.availability.total - model.availability.available;
      return {
        key: `${model.vendor}-${model.model}-${model.ram}`,
        label: formatGpuModelName(model.vendor, model.model, model.ram),
        percent: used / model.availability.total,
        used,
        total: model.availability.total,
        pricePerHour: model.price?.avg ?? null
      };
    });

  if (rows.length === 0) return null;

  return <GpuPriceList rows={rows} />;
};
