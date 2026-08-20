"use client";
import type { FC } from "react";
import { Spinner } from "@akashnetwork/ui/components";

import { GpuTrendChart } from "@/components/charts/GpuTrendChart/GpuTrendChart";
import { LeasesTrendChart } from "@/components/charts/LeasesTrendChart/LeasesTrendChart";
import { useSplitSnapshots } from "@/hooks/useSplitSnapshots";
import { useGraphSnapshot } from "@/queries";
import { Snapshots } from "@/types";

export type LeasesGpuTrendsContainerProps = {
  totalGPU: number;
};

export const LeasesGpuTrendsContainer: FC<LeasesGpuTrendsContainerProps> = ({ totalGPU }) => {
  const leases = useGraphSnapshot(Snapshots.activeLeaseCount);
  const gpu = useGraphSnapshot(Snapshots.activeGPU);

  const { completed: leasesCompleted } = useSplitSnapshots(leases.data);
  const { completed: gpuCompleted } = useSplitSnapshots(gpu.data);

  if (leases.status === "pending" || gpu.status === "pending") {
    return (
      <div className="flex min-h-[160px] items-center justify-center rounded-xl border">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {leases.data && leasesCompleted && (
        <LeasesTrendChart completedSnapshots={leasesCompleted} currentValue={leases.data.currentValue} isFetching={leases.isFetching} />
      )}
      {gpu.data && gpuCompleted && <GpuTrendChart completedSnapshots={gpuCompleted} totalGPU={totalGPU} isFetching={gpu.isFetching} />}
    </div>
  );
};
