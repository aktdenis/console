"use client";
import type { FC } from "react";
import { Spinner } from "@akashnetwork/ui/components";

import { DailySpendChart } from "@/components/charts/DailySpendChart/DailySpendChart";
import { useSplitSnapshots } from "@/hooks/useSplitSnapshots";
import { useGraphSnapshot } from "@/queries";
import { Snapshots } from "@/types";

export const DailySpendChartContainer: FC = () => {
  const { data: snapshotData, status, isFetching } = useGraphSnapshot(Snapshots.dailyUUsdSpent);
  const { completed: completedSnapshots } = useSplitSnapshots(snapshotData);

  if (status === "pending") {
    return (
      <div className="flex min-h-[230px] items-center justify-center rounded-xl border">
        <Spinner size="large" />
      </div>
    );
  }

  if (!snapshotData || !completedSnapshots) {
    return null;
  }

  return (
    <DailySpendChart
      completedSnapshots={completedSnapshots}
      currentValue={snapshotData.currentValue}
      compareValue={snapshotData.compareValue}
      isFetching={isFetching}
    />
  );
};
