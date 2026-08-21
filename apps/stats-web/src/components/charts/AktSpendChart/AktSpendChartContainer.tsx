"use client";
import type { FC } from "react";
import { Spinner } from "@akashnetwork/ui/components";

import { AktSpendChart } from "@/components/charts/AktSpendChart/AktSpendChart";
import { useSplitSnapshots } from "@/hooks/useSplitSnapshots";
import { useGraphSnapshot } from "@/queries";
import { Snapshots } from "@/types";

export const AktSpendChartContainer: FC = () => {
  const { data: snapshotData, status, isFetching } = useGraphSnapshot(Snapshots.dailyUAktSpent);
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
    <AktSpendChart
      completedSnapshots={completedSnapshots}
      currentValue={snapshotData.currentValue}
      compareValue={snapshotData.compareValue}
      isFetching={isFetching}
    />
  );
};
