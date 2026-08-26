"use client";
import type { FC } from "react";
import { Spinner } from "@akashnetwork/ui/components";

import { HomenodeTile } from "@/app/(home)/HomenodeTile";
import { GpuPriceListContainer } from "@/components/charts/GpuPriceList/GpuPriceListContainer";
import { GpuTrendChart } from "@/components/charts/GpuTrendChart/GpuTrendChart";
import { useSplitSnapshots } from "@/hooks/useSplitSnapshots";
import { useGraphSnapshot } from "@/queries";
import { Snapshots } from "@/types";

export type GpuTrendsContainerProps = {
  totalGPU: number;
};

export const GpuTrendsContainer: FC<GpuTrendsContainerProps> = ({ totalGPU }) => {
  const gpu = useGraphSnapshot(Snapshots.activeGPU);

  const { completed: gpuCompleted } = useSplitSnapshots(gpu.data);

  if (gpu.status === "pending") {
    return (
      <div className="flex min-h-[160px] items-center justify-center rounded-xl border">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        {gpu.data && gpuCompleted && <GpuTrendChart completedSnapshots={gpuCompleted} totalGPU={totalGPU} isFetching={gpu.isFetching} />}
        <HomenodeTile />
      </div>
      <GpuPriceListContainer />
    </div>
  );
};
