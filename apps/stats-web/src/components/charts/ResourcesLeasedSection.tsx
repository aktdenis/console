import { type FC, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIconItem,
  DropdownMenuTrigger
} from "@akashnetwork/ui/components";
import { BarChart3, Check, ChevronDown, CircleDot } from "lucide-react";

import { ChartRangeToggle } from "@/components/charts/ChartRangeToggle";
import { GpuPriceListContainer } from "@/components/charts/GpuPriceList/GpuPriceListContainer";
import { NetworkProviderCta } from "@/components/charts/NetworkProviderCta";
import { DEFAULT_GRANULARITY_KEY, GRANULARITY_OPTIONS } from "@/components/charts/ResourcesLeasedBubbleChart";
import { ResourcesLeasedBubbleChartContainer } from "@/components/charts/ResourcesLeasedBubbleChartContainer";
import type { SpendChartViewMode } from "@/components/charts/SpendChart/SpendChart";
import { SpendChartContainer } from "@/components/charts/SpendChart/SpendChartContainer";
import { COMPUTE_DENOM, GRAPHICS_DENOM, MEMORY_DENOM, STORAGE_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import { DiffPercentageChip } from "@/components/DiffPercentageChip";
import { StatCardTabs } from "@/components/StatCardTabs";
import { percIncrease } from "@/lib/mathHelpers";
import type { DashboardBlockStats } from "@/types";

export const DEPENDENCIES = { SpendChartContainer, ResourcesLeasedBubbleChartContainer, GpuPriceListContainer, NetworkProviderCta };

export type ResourcesLeasedSectionProps = {
  now: DashboardBlockStats;
  compare: DashboardBlockStats;
  viewMode?: SpendChartViewMode;
  dependencies?: typeof DEPENDENCIES;
};

type ViewMode = "classic" | "bubble";

const CLASSIC_DEFAULT_RANGE_KEY = "3M";

const VIEW_OPTIONS: { key: ViewMode; label: string; icon: typeof BarChart3 }[] = [
  { key: "classic", label: "Classic", icon: BarChart3 },
  { key: "bubble", label: "Bubble", icon: CircleDot }
];

export const ResourcesLeasedSection: FC<ResourcesLeasedSectionProps> = ({ now, compare, viewMode, dependencies: d = DEPENDENCIES }) => {
  const [view, setView] = useState<ViewMode>("classic");
  const [granularityKey, setGranularityKey] = useState<string>(DEFAULT_GRANULARITY_KEY);
  const activeView = VIEW_OPTIONS.find(option => option.key === view) ?? VIEW_OPTIONS[0];

  return (
    <div className="flex flex-col gap-2">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
          <CardTitle className="text-base">Compute Leased</CardTitle>

          <div className="flex items-center gap-2">
            {view === "bubble" && <ChartRangeToggle options={GRANULARITY_OPTIONS} value={granularityKey} onValueChange={setGranularityKey} />}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <activeView.icon className="size-4" aria-hidden="true" />
                  {activeView.label}
                  <ChevronDown className="size-4 opacity-50" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {VIEW_OPTIONS.map(option => (
                  <DropdownMenuIconItem key={option.key} icon={<option.icon className="size-4" />} onSelect={() => setView(option.key)}>
                    <span className="flex flex-1 items-center justify-between gap-4">
                      {option.label}
                      {option.key === view && <Check className="size-4" />}
                    </span>
                  </DropdownMenuIconItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent>
          {view === "classic" ? (
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
                  panel: (
                    <d.SpendChartContainer
                      denom={COMPUTE_DENOM}
                      className="rounded-t-none border-t-0"
                      defaultRangeKey={CLASSIC_DEFAULT_RANGE_KEY}
                      viewMode={viewMode}
                    />
                  )
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
                  panel: (
                    <d.SpendChartContainer
                      denom={GRAPHICS_DENOM}
                      className="rounded-t-none border-t-0"
                      defaultRangeKey={CLASSIC_DEFAULT_RANGE_KEY}
                      viewMode={viewMode}
                    />
                  )
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
                  panel: (
                    <d.SpendChartContainer
                      denom={MEMORY_DENOM}
                      className="rounded-t-none border-t-0"
                      defaultRangeKey={CLASSIC_DEFAULT_RANGE_KEY}
                      viewMode={viewMode}
                    />
                  )
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
                  panel: (
                    <d.SpendChartContainer
                      denom={STORAGE_DENOM}
                      className="rounded-t-none border-t-0"
                      defaultRangeKey={CLASSIC_DEFAULT_RANGE_KEY}
                      viewMode={viewMode}
                    />
                  )
                }
              ]}
            />
          ) : (
            <d.ResourcesLeasedBubbleChartContainer granularityKey={granularityKey} />
          )}
        </CardContent>
      </Card>

      <d.GpuPriceListContainer />
      <d.NetworkProviderCta />
    </div>
  );
};
