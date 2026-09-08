import type { FC } from "react";

import type { SpendChartViewMode } from "@/components/charts/SpendChart/SpendChart";
import { SpendChartContainer } from "@/components/charts/SpendChart/SpendChartContainer";
import { USD_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import { DiffPercentageChip } from "@/components/DiffPercentageChip";
import { StatCard } from "@/components/StatCard";
import { percIncrease, udenomToDenom } from "@/lib/mathHelpers";
import type { DashboardBlockStats } from "@/types";

export const DEPENDENCIES = { SpendChartContainer };

export type AssetsSpentSectionProps = {
  now: DashboardBlockStats;
  compare: DashboardBlockStats;
  viewMode?: SpendChartViewMode;
  dependencies?: typeof DEPENDENCIES;
};

export const AssetsSpentSection: FC<AssetsSpentSectionProps> = ({ now, compare, viewMode, dependencies: d = DEPENDENCIES }) => (
  <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
    <div className="lg:col-span-3">
      <d.SpendChartContainer denom={USD_DENOM} viewMode={viewMode} />
    </div>

    <div className="flex flex-col gap-2 lg:col-span-1">
      <StatCard
        className="flex-1"
        label="Total spent USD"
        tooltip={USD_DENOM.totalTooltip}
        content={
          <>
            {USD_DENOM.formatTotal(udenomToDenom(now.totalUUsdSpent))}
            <DiffPercentageChip value={percIncrease(compare.totalUUsdSpent, now.totalUUsdSpent)} />
          </>
        }
      />
      <StatCard
        className="flex-1"
        label="USD Spent (24h)"
        tooltip="Amount spent in the last 24h (ACT + AKT converted to USD)."
        content={
          <>
            {USD_DENOM.formatAmount(udenomToDenom(now.dailyUUsdSpent))}
            <DiffPercentageChip value={percIncrease(compare.dailyUUsdSpent, now.dailyUUsdSpent)} />
          </>
        }
      />
    </div>
  </div>
);
