"use client";
import type { FC } from "react";
import { Spinner } from "@akashnetwork/ui/components";

import { LeasesTrendChart } from "@/components/charts/LeasesTrendChart/LeasesTrendChart";
import { useSplitSnapshots } from "@/hooks/useSplitSnapshots";
import { useGraphSnapshot } from "@/queries";
import { Snapshots } from "@/types";

export const LeasesTrendContainer: FC = () => {
  const leases = useGraphSnapshot(Snapshots.activeLeaseCount);

  const { completed: leasesCompleted } = useSplitSnapshots(leases.data);

  if (leases.status === "pending") {
    return (
      <div className="flex min-h-[160px] items-center justify-center rounded-xl border">
        <Spinner size="large" />
      </div>
    );
  }

  if (!leases.data || !leasesCompleted) return null;

  return <LeasesTrendChart completedSnapshots={leasesCompleted} currentValue={leases.data.currentValue} isFetching={leases.isFetching} />;
};
