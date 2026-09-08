"use client";
import type { FC } from "react";
import { Spinner } from "@akashnetwork/ui/components";

import type { SpendChartViewMode } from "@/components/charts/SpendChart/SpendChart";
import { SpendChartContainer } from "@/components/charts/SpendChart/SpendChartContainer";
import {
  ACT_BURNED_FOR_AKT_DENOM,
  ACT_MINTED_DENOM,
  AKT_BURNED_FOR_ACT_DENOM,
  AKT_REMINTED_DENOM,
  COLLATERAL_RATIO_DENOM,
  NET_AKT_BURNED_DENOM,
  OUTSTANDING_ACT_DENOM,
  VAULT_AKT_DENOM
} from "@/components/charts/SpendChart/spendDenoms";
import { useBmeDashboardData } from "@/queries";

export const DEPENDENCIES = { SpendChartContainer, useBmeDashboardData };

export type BmeReportProps = {
  viewMode: SpendChartViewMode;
  dependencies?: typeof DEPENDENCIES;
};

export const BmeReport: FC<BmeReportProps> = ({ viewMode, dependencies: d = DEPENDENCIES }) => {
  const { data: dashboardData, isLoading } = d.useBmeDashboardData();

  if (!dashboardData?.now || !dashboardData?.compare) {
    return isLoading ? (
      <div className="flex items-center justify-center p-4">
        <Spinner size="large" />
      </div>
    ) : null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <d.SpendChartContainer denom={OUTSTANDING_ACT_DENOM} viewMode={viewMode} className="h-full" />
        <d.SpendChartContainer denom={VAULT_AKT_DENOM} viewMode={viewMode} className="h-full" />
        <d.SpendChartContainer denom={NET_AKT_BURNED_DENOM} viewMode={viewMode} className="h-full" />
        <d.SpendChartContainer denom={COLLATERAL_RATIO_DENOM} viewMode={viewMode} className="h-full" />
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <d.SpendChartContainer denom={AKT_BURNED_FOR_ACT_DENOM} viewMode={viewMode} className="h-full" />
        <d.SpendChartContainer denom={ACT_MINTED_DENOM} viewMode={viewMode} className="h-full" />
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <d.SpendChartContainer denom={ACT_BURNED_FOR_AKT_DENOM} viewMode={viewMode} className="h-full" />
        <d.SpendChartContainer denom={AKT_REMINTED_DENOM} viewMode={viewMode} className="h-full" />
      </div>
    </div>
  );
};
