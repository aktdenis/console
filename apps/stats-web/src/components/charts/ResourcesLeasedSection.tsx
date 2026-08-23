import type { FC } from "react";

import { SpendChartContainer } from "@/components/charts/SpendChart/SpendChartContainer";
import { COMPUTE_DENOM, GRAPHICS_DENOM, MEMORY_DENOM, STORAGE_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import { DiffPercentageChip } from "@/components/DiffPercentageChip";
import { StatCardTabs } from "@/components/StatCardTabs";
import { percIncrease } from "@/lib/mathHelpers";
import type { DashboardBlockStats } from "@/types";

export const DEPENDENCIES = { SpendChartContainer };

export type ResourcesLeasedSectionProps = {
  now: DashboardBlockStats;
  compare: DashboardBlockStats;
  dependencies?: typeof DEPENDENCIES;
};

export const ResourcesLeasedSection: FC<ResourcesLeasedSectionProps> = ({ now, compare, dependencies: d = DEPENDENCIES }) => (
  <StatCardTabs
    defaultValue={COMPUTE_DENOM.key}
    items={[
      {
        value: COMPUTE_DENOM.key,
        label: COMPUTE_DENOM.tabLabel,
        tooltip: COMPUTE_DENOM.totalTooltip,
        content: (
          <>
            {COMPUTE_DENOM.formatTotal(COMPUTE_DENOM.toDisplayValue(now.activeCPU))}
            <DiffPercentageChip value={percIncrease(compare.activeCPU, now.activeCPU)} />
          </>
        ),
        panel: <d.SpendChartContainer denom={COMPUTE_DENOM} className="rounded-t-none border-t-0" />
      },
      {
        value: GRAPHICS_DENOM.key,
        label: GRAPHICS_DENOM.tabLabel,
        tooltip: GRAPHICS_DENOM.totalTooltip,
        content: (
          <>
            {GRAPHICS_DENOM.formatTotal(GRAPHICS_DENOM.toDisplayValue(now.activeGPU))}
            <DiffPercentageChip value={percIncrease(compare.activeGPU, now.activeGPU)} />
          </>
        ),
        panel: <d.SpendChartContainer denom={GRAPHICS_DENOM} className="rounded-t-none border-t-0" />
      },
      {
        value: MEMORY_DENOM.key,
        label: MEMORY_DENOM.tabLabel,
        tooltip: MEMORY_DENOM.totalTooltip,
        content: (
          <>
            {MEMORY_DENOM.formatTotal(MEMORY_DENOM.toDisplayValue(now.activeMemory))}
            <DiffPercentageChip value={percIncrease(compare.activeMemory, now.activeMemory)} />
          </>
        ),
        panel: <d.SpendChartContainer denom={MEMORY_DENOM} className="rounded-t-none border-t-0" />
      },
      {
        value: STORAGE_DENOM.key,
        label: STORAGE_DENOM.tabLabel,
        tooltip: STORAGE_DENOM.totalTooltip,
        content: (
          <>
            {STORAGE_DENOM.formatTotal(STORAGE_DENOM.toDisplayValue(now.activeStorage))}
            <DiffPercentageChip value={percIncrease(compare.activeStorage, now.activeStorage)} />
          </>
        ),
        panel: <d.SpendChartContainer denom={STORAGE_DENOM} className="rounded-t-none border-t-0" />
      }
    ]}
  />
);
