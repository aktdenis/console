import type { FC } from "react";

import type { SpendChartViewMode } from "@/components/charts/SpendChart/SpendChart";
import { SpendChartContainer } from "@/components/charts/SpendChart/SpendChartContainer";
import { COMPUTE_DENOM, GRAPHICS_DENOM, LEASE_COUNT_DENOM, MEMORY_DENOM, STORAGE_DENOM } from "@/components/charts/SpendChart/spendDenoms";

const RESOURCE_DEFAULT_RANGE_KEY = "3M";

export const DEPENDENCIES = { SpendChartContainer };

export type ComputeLeasedReportProps = {
  viewMode: SpendChartViewMode;
  dependencies?: typeof DEPENDENCIES;
};

export const ComputeLeasedReport: FC<ComputeLeasedReportProps> = ({ viewMode, dependencies: d = DEPENDENCIES }) => (
  <div className="flex flex-col gap-2">
    <d.SpendChartContainer denom={LEASE_COUNT_DENOM} viewMode={viewMode} />

    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <d.SpendChartContainer denom={COMPUTE_DENOM} viewMode={viewMode} defaultRangeKey={RESOURCE_DEFAULT_RANGE_KEY} className="h-full" />
      <d.SpendChartContainer denom={GRAPHICS_DENOM} viewMode={viewMode} defaultRangeKey={RESOURCE_DEFAULT_RANGE_KEY} className="h-full" />
      <d.SpendChartContainer denom={MEMORY_DENOM} viewMode={viewMode} defaultRangeKey={RESOURCE_DEFAULT_RANGE_KEY} className="h-full" />
      <d.SpendChartContainer denom={STORAGE_DENOM} viewMode={viewMode} defaultRangeKey={RESOURCE_DEFAULT_RANGE_KEY} className="h-full" />
    </div>
  </div>
);
