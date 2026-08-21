"use client";
import type { FC } from "react";
import { Spinner } from "@akashnetwork/ui/components";

import { SpendChart } from "@/components/charts/SpendChart/SpendChart";
import type { SpendDenom } from "@/components/charts/SpendChart/spendDenoms";
import { useSplitSnapshots } from "@/hooks/useSplitSnapshots";
import { useGraphSnapshot } from "@/queries";

export type SpendChartContainerProps = {
  denom: SpendDenom;
  className?: string;
};

export const SpendChartContainer: FC<SpendChartContainerProps> = ({ denom, className }) => {
  const { data: snapshotData, status, isFetching } = useGraphSnapshot(denom.snapshotKey);
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
    <SpendChart
      denom={denom}
      completedSnapshots={completedSnapshots}
      currentValue={snapshotData.currentValue}
      compareValue={snapshotData.compareValue}
      isFetching={isFetching}
      className={className}
    />
  );
};
