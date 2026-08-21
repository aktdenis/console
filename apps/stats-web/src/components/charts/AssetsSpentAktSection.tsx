import type { FC } from "react";

import { SpendChartContainer } from "@/components/charts/SpendChart/SpendChartContainer";
import { ACT_DENOM, AKT_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import { DiffPercentageChip } from "@/components/DiffPercentageChip";
import { StatCardTabs } from "@/components/StatCardTabs";
import { percIncrease, udenomToDenom } from "@/lib/mathHelpers";
import type { DashboardBlockStats } from "@/types";

export const DEPENDENCIES = { SpendChartContainer };

export type AssetsSpentAktSectionProps = {
  now: DashboardBlockStats;
  compare: DashboardBlockStats;
  dependencies?: typeof DEPENDENCIES;
};

export const AssetsSpentAktSection: FC<AssetsSpentAktSectionProps> = ({ now, compare, dependencies: d = DEPENDENCIES }) => (
  <StatCardTabs
    defaultValue={AKT_DENOM.key}
    items={[
      {
        value: ACT_DENOM.key,
        label: ACT_DENOM.tabLabel,
        tooltip: ACT_DENOM.totalTooltip,
        content: (
          <>
            {ACT_DENOM.formatTotal(udenomToDenom(now.totalUActSpent))}
            <DiffPercentageChip value={percIncrease(compare.totalUActSpent, now.totalUActSpent)} />
          </>
        ),
        panel: <d.SpendChartContainer denom={ACT_DENOM} className="rounded-t-none border-t-0" />
      },
      {
        value: AKT_DENOM.key,
        label: AKT_DENOM.tabLabel,
        tooltip: AKT_DENOM.totalTooltip,
        content: (
          <>
            {AKT_DENOM.formatTotal(udenomToDenom(now.totalUAktSpent))}
            <DiffPercentageChip value={percIncrease(compare.totalUAktSpent, now.totalUAktSpent)} />
          </>
        ),
        panel: <d.SpendChartContainer denom={AKT_DENOM} className="rounded-t-none border-t-0" />
      }
    ]}
  />
);
