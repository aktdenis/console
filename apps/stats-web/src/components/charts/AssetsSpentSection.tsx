import type { FC } from "react";

import { SpendChartContainer } from "@/components/charts/SpendChart/SpendChartContainer";
import { USD_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import { DiffPercentageChip } from "@/components/DiffPercentageChip";
import { StatCardRow } from "@/components/StatCardRow";
import { percIncrease, udenomToDenom } from "@/lib/mathHelpers";
import type { DashboardBlockStats } from "@/types";

export const DEPENDENCIES = { SpendChartContainer };

export type AssetsSpentSectionProps = {
  now: DashboardBlockStats;
  compare: DashboardBlockStats;
  dependencies?: typeof DEPENDENCIES;
};

export const AssetsSpentSection: FC<AssetsSpentSectionProps> = ({ now, compare, dependencies: d = DEPENDENCIES }) => (
  <>
    <StatCardRow
      items={[
        {
          key: "daily",
          label: "USD Spent (24h)",
          tooltip: "Amount spent in the last 24h (ACT + AKT converted to USD).",
          content: (
            <>
              {USD_DENOM.formatAmount(udenomToDenom(now.dailyUUsdSpent))}
              <DiffPercentageChip value={percIncrease(compare.dailyUUsdSpent, now.dailyUUsdSpent)} />
            </>
          )
        },
        {
          key: "total",
          label: "Total spent USD",
          tooltip: USD_DENOM.totalTooltip,
          content: (
            <>
              {USD_DENOM.formatTotal(udenomToDenom(now.totalUUsdSpent))}
              <DiffPercentageChip value={percIncrease(compare.totalUUsdSpent, now.totalUUsdSpent)} />
            </>
          )
        }
      ]}
    />
    <d.SpendChartContainer denom={USD_DENOM} className="rounded-t-none border-t-0" />
  </>
);
