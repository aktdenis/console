import type { FC } from "react";
import { FormattedNumber } from "react-intl";

import { AKTLabel } from "@/components/AKTLabel";
import { AktSpendChartContainer } from "@/components/charts/AktSpendChart/AktSpendChartContainer";
import { DiffPercentageChip } from "@/components/DiffPercentageChip";
import { StatCardRow } from "@/components/StatCardRow";
import { ACTLabel } from "@/components/UsdLabel";
import { percIncrease, udenomToDenom } from "@/lib/mathHelpers";
import type { DashboardBlockStats } from "@/types";

export const DEPENDENCIES = { AktSpendChartContainer };

export type AssetsSpentAktSectionProps = {
  now: DashboardBlockStats;
  compare: DashboardBlockStats;
  dependencies?: typeof DEPENDENCIES;
};

export const AssetsSpentAktSection: FC<AssetsSpentAktSectionProps> = ({ now, compare, dependencies: d = DEPENDENCIES }) => (
  <>
    <StatCardRow
      items={[
        {
          key: "akt-spent",
          label: "AKT Spent",
          tooltip: "Total AKT spent to rent computing power on the Akash network since the beginning of the network (March 2021).",
          value: (
            <>
              <FormattedNumber value={udenomToDenom(now.totalUAktSpent)} notation="compact" maximumFractionDigits={2} />
              <AKTLabel />
              <DiffPercentageChip value={percIncrease(compare.totalUAktSpent, now.totalUAktSpent)} />
            </>
          )
        },
        {
          key: "act-spent",
          label: "ACT Spent",
          tooltip: "Total ACT spent to rent computing power on the Akash network (includes historical USDC at 1:1).",
          value: (
            <>
              <FormattedNumber value={udenomToDenom(now.totalUActSpent)} style="currency" currency="USD" notation="compact" maximumFractionDigits={2} />
              <ACTLabel />
              <DiffPercentageChip value={percIncrease(compare.totalUActSpent, now.totalUActSpent)} />
            </>
          )
        }
      ]}
    />

    <div className="mt-6">
      <d.AktSpendChartContainer />
    </div>
  </>
);
