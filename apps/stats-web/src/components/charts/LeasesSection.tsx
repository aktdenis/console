import type { FC } from "react";
import { FormattedNumber } from "react-intl";

import { SpendChartContainer } from "@/components/charts/SpendChart/SpendChartContainer";
import { LEASE_COUNT_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import { DiffPercentageChip } from "@/components/DiffPercentageChip";
import { StatCardRow } from "@/components/StatCardRow";
import { percIncrease } from "@/lib/mathHelpers";
import type { DashboardBlockStats } from "@/types";

export const DEPENDENCIES = { SpendChartContainer };

export type LeasesSectionProps = {
  now: DashboardBlockStats;
  compare: DashboardBlockStats;
  dependencies?: typeof DEPENDENCIES;
};

export const LeasesSection: FC<LeasesSectionProps> = ({ now, compare, dependencies: d = DEPENDENCIES }) => (
  <div className="flex flex-col gap-6">
    <StatCardRow
      className="lg:grid-cols-3"
      items={[
        {
          key: "new",
          label: "New leases (24h)",
          tooltip: "Last 24h",
          content: (
            <>
              <FormattedNumber value={now.totalLeaseCount - compare.totalLeaseCount} notation="compact" compactDisplay="short" />
              <DiffPercentageChip value={percIncrease(compare.dailyLeaseCount, now.dailyLeaseCount)} />
            </>
          )
        },
        {
          key: "total",
          label: "Total leases",
          tooltip:
            "The total lease count consists of all deployments that were live at some point and that someone paid for. This includes deployments that were deployed for testing or that were meant to be only temporary.",
          content: (
            <>
              <FormattedNumber value={now.totalLeaseCount} notation="compact" compactDisplay="short" />
              <DiffPercentageChip value={percIncrease(compare.totalLeaseCount, now.totalLeaseCount)} />
            </>
          )
        },
        {
          key: "active",
          label: "Active leases",
          tooltip:
            "The number of leases currently active on the network. A deployment can be anything, from a simple website to a blockchain node or a video game server.",
          content: (
            <>
              <FormattedNumber value={now.activeLeaseCount} notation="compact" compactDisplay="short" maximumFractionDigits={2} />
              <DiffPercentageChip value={percIncrease(compare.activeLeaseCount, now.activeLeaseCount)} />
            </>
          )
        }
      ]}
    />
    <d.SpendChartContainer denom={LEASE_COUNT_DENOM} />
  </div>
);
