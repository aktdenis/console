"use client";
import type { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger, Tooltip, TooltipContent, TooltipTrigger } from "@akashnetwork/ui/components";
import { InfoCircle } from "iconoir-react";

import { BmeStatusBadge } from "./BmeStatusBadge";

import { BME_LEARN_MORE_RESOURCES } from "@/components/bme/bmeLearnMoreResources";
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
import { DiffPercentageChip } from "@/components/DiffPercentageChip";
import { LinkTiles } from "@/components/LinkTiles";
import { StatCardTabs } from "@/components/StatCardTabs";
import { Title } from "@/components/Title";
import { percIncrease } from "@/lib/mathHelpers";
import type { BmeStatusHistoryResponse } from "@/queries";
import type { BmeDashboardData } from "@/types";

export const DEPENDENCIES = { BmeStatusBadge, SpendChartContainer };

interface BmeDashboardProps {
  dashboardData: BmeDashboardData;
  statusHistory: BmeStatusHistoryResponse;
  dependencies?: typeof DEPENDENCIES;
}

export const BmeDashboard: FC<BmeDashboardProps> = ({ dashboardData, statusHistory, dependencies: d = DEPENDENCIES }) => {
  const latestStatus = statusHistory.length > 0 ? statusHistory[statusHistory.length - 1] : null;
  const { now, compare } = dashboardData;

  return (
    <>
      <Title subTitle className="mb-5 text-3xl font-bold tracking-tight sm:text-3xl">
        BME Activity
      </Title>

      <Tabs defaultValue="summary">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="bg-muted">
            <TabsTrigger value="summary" className="px-2 py-1">
              Summary
            </TabsTrigger>
            <TabsTrigger value="akt-burn-act-mint" className="px-2 py-1">
              AKT Burn &amp; ACT Mint
            </TabsTrigger>
            <TabsTrigger value="act-burn-akt-remint" className="px-2 py-1">
              ACT Burn &amp; AKT Remint
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            Circuit Breaker Status
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoCircle className="size-4" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-balance">Current mint status derived from the latest circuit breaker event</TooltipContent>
            </Tooltip>
            <d.BmeStatusBadge status={latestStatus?.newStatus ?? "unknown"} size="sm" />
          </div>
        </div>

        <TabsContent value="summary" className="mt-6">
          <div className="flex flex-col gap-6">
            <d.SpendChartContainer denom={OUTSTANDING_ACT_DENOM} />
            <d.SpendChartContainer denom={VAULT_AKT_DENOM} />
            <d.SpendChartContainer denom={NET_AKT_BURNED_DENOM} />
            <d.SpendChartContainer denom={COLLATERAL_RATIO_DENOM} />
          </div>

          <p className="mb-4 mt-8 text-lg font-semibold tracking-tight text-foreground">Learn more</p>
          <LinkTiles items={BME_LEARN_MORE_RESOURCES} />
        </TabsContent>

        <TabsContent value="akt-burn-act-mint" className="mt-6">
          <StatCardTabs
            defaultValue={AKT_BURNED_FOR_ACT_DENOM.key}
            items={[
              {
                value: AKT_BURNED_FOR_ACT_DENOM.key,
                label: AKT_BURNED_FOR_ACT_DENOM.tabLabel,
                tooltip: AKT_BURNED_FOR_ACT_DENOM.totalTooltip,
                content: (
                  <>
                    {AKT_BURNED_FOR_ACT_DENOM.formatTotal(AKT_BURNED_FOR_ACT_DENOM.toDisplayValue(now.totalAktBurnedForAct))}
                    <DiffPercentageChip value={percIncrease(compare.totalAktBurnedForAct, now.totalAktBurnedForAct)} />
                  </>
                ),
                panel: <d.SpendChartContainer denom={AKT_BURNED_FOR_ACT_DENOM} className="rounded-t-none border-t-0" />
              },
              {
                value: ACT_MINTED_DENOM.key,
                label: ACT_MINTED_DENOM.tabLabel,
                tooltip: ACT_MINTED_DENOM.totalTooltip,
                content: (
                  <>
                    {ACT_MINTED_DENOM.formatTotal(ACT_MINTED_DENOM.toDisplayValue(now.totalActMinted))}
                    <DiffPercentageChip value={percIncrease(compare.totalActMinted, now.totalActMinted)} />
                  </>
                ),
                panel: <d.SpendChartContainer denom={ACT_MINTED_DENOM} className="rounded-t-none border-t-0" />
              }
            ]}
          />
        </TabsContent>

        <TabsContent value="act-burn-akt-remint" className="mt-6">
          <StatCardTabs
            defaultValue={ACT_BURNED_FOR_AKT_DENOM.key}
            items={[
              {
                value: ACT_BURNED_FOR_AKT_DENOM.key,
                label: ACT_BURNED_FOR_AKT_DENOM.tabLabel,
                tooltip: ACT_BURNED_FOR_AKT_DENOM.totalTooltip,
                content: (
                  <>
                    {ACT_BURNED_FOR_AKT_DENOM.formatTotal(ACT_BURNED_FOR_AKT_DENOM.toDisplayValue(now.totalActBurnedForAkt))}
                    <DiffPercentageChip value={percIncrease(compare.totalActBurnedForAkt, now.totalActBurnedForAkt)} />
                  </>
                ),
                panel: <d.SpendChartContainer denom={ACT_BURNED_FOR_AKT_DENOM} className="rounded-t-none border-t-0" />
              },
              {
                value: AKT_REMINTED_DENOM.key,
                label: AKT_REMINTED_DENOM.tabLabel,
                tooltip: AKT_REMINTED_DENOM.totalTooltip,
                content: (
                  <>
                    {AKT_REMINTED_DENOM.formatTotal(AKT_REMINTED_DENOM.toDisplayValue(now.totalAktReminted))}
                    <DiffPercentageChip value={percIncrease(compare.totalAktReminted, now.totalAktReminted)} />
                  </>
                ),
                panel: <d.SpendChartContainer denom={AKT_REMINTED_DENOM} className="rounded-t-none border-t-0" />
              }
            ]}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};
