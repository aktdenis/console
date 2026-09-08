import type { FC } from "react";

import type { SpendChartViewMode } from "@/components/charts/SpendChart/SpendChart";
import { SpendChartContainer } from "@/components/charts/SpendChart/SpendChartContainer";
import { ACT_DENOM, AKT_DENOM, USD_DENOM } from "@/components/charts/SpendChart/spendDenoms";

export const DEPENDENCIES = { SpendChartContainer };

export type AssetsSpentReportProps = {
  viewMode: SpendChartViewMode;
  dependencies?: typeof DEPENDENCIES;
};

export const AssetsSpentReport: FC<AssetsSpentReportProps> = ({ viewMode, dependencies: d = DEPENDENCIES }) => (
  <div className="flex flex-col gap-2">
    <d.SpendChartContainer denom={USD_DENOM} viewMode={viewMode} />

    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <d.SpendChartContainer denom={ACT_DENOM} viewMode={viewMode} className="h-full" />
      <d.SpendChartContainer denom={AKT_DENOM} viewMode={viewMode} className="h-full" />
    </div>
  </div>
);
