"use client";
import type { FC } from "react";
import { Spinner } from "@akashnetwork/ui/components";

import { type BubbleChartSeries, ResourcesLeasedBubbleChart } from "@/components/charts/ResourcesLeasedBubbleChart";
import { COMPUTE_DENOM, GRAPHICS_DENOM, MEMORY_DENOM, STORAGE_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import { useSplitSnapshots } from "@/hooks/useSplitSnapshots";
import { useGraphSnapshot } from "@/queries";

export type ResourcesLeasedBubbleChartContainerProps = {
  granularityKey: string;
};

export const ResourcesLeasedBubbleChartContainer: FC<ResourcesLeasedBubbleChartContainerProps> = ({ granularityKey }) => {
  const { data: computeData, status: computeStatus } = useGraphSnapshot(COMPUTE_DENOM.snapshotKey);
  const { data: graphicsData, status: graphicsStatus } = useGraphSnapshot(GRAPHICS_DENOM.snapshotKey);
  const { data: memoryData, status: memoryStatus } = useGraphSnapshot(MEMORY_DENOM.snapshotKey);
  const { data: storageData, status: storageStatus } = useGraphSnapshot(STORAGE_DENOM.snapshotKey);

  const { completed: computeCompleted } = useSplitSnapshots(computeData);
  const { completed: graphicsCompleted } = useSplitSnapshots(graphicsData);
  const { completed: memoryCompleted } = useSplitSnapshots(memoryData);
  const { completed: storageCompleted } = useSplitSnapshots(storageData);

  const isPending = [computeStatus, graphicsStatus, memoryStatus, storageStatus].some(status => status === "pending");
  if (isPending) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-xl border">
        <Spinner size="large" />
      </div>
    );
  }

  if (!computeCompleted || !graphicsCompleted || !memoryCompleted || !storageCompleted) return null;

  const series: BubbleChartSeries[] = [
    { denom: COMPUTE_DENOM, completedSnapshots: computeCompleted },
    { denom: GRAPHICS_DENOM, completedSnapshots: graphicsCompleted },
    { denom: MEMORY_DENOM, completedSnapshots: memoryCompleted },
    { denom: STORAGE_DENOM, completedSnapshots: storageCompleted }
  ];

  return <ResourcesLeasedBubbleChart series={series} granularityKey={granularityKey} />;
};
