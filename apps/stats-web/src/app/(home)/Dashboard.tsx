"use client";
import React from "react";

import { BecomeProviderTile } from "./BecomeProviderTile";
import { BottomCta } from "./BottomCta";
import { LiveActivityTicker } from "./LiveActivityTicker";
import { OverviewStatsCarousel } from "./OverviewStatsCarousel";
import { PlaygroundCtaTile } from "./PlaygroundCtaTile";

import { DailySpendChartContainer } from "@/components/charts/DailySpendChart/DailySpendChartContainer";
import { GlobalGridContainer } from "@/components/charts/GlobalGrid/GlobalGridContainer";
import { GpuTrendsContainer } from "@/components/charts/GpuTrendsContainer";
import { LeasesTrendContainer } from "@/components/charts/LeasesTrendContainer";
import { NetworkCapacitySummary } from "@/components/charts/NetworkCapacitySummary";
import { USD_DENOM } from "@/components/charts/SpendChart/spendDenoms";
import { DiffPercentageChip } from "@/components/DiffPercentageChip";
import { CompareTool } from "@/components/NetworkReport/CompareTool";
import { StatCard } from "@/components/StatCard";
import { percIncrease, udenomToDenom } from "@/lib/mathHelpers";
import type { DashboardData, MarketData } from "@/types";

interface IDashboardProps {
  dashboardData: DashboardData;
  marketData: MarketData;
}

export const Dashboard: React.FunctionComponent<IDashboardProps> = ({ dashboardData }) => {
  return (
    <>
      <LiveActivityTicker latestBlocks={dashboardData.latestBlocks} latestTransactions={dashboardData.latestTransactions} />

      {dashboardData.now && dashboardData.compare && (
        <>
          <div className="mt-2">
            <OverviewStatsCarousel dashboardData={dashboardData} />
          </div>

          <div className="mt-2">
            <DailySpendChartContainer />
          </div>

          <div className="mt-2">
            <CompareTool viewMode="chart" />
          </div>

          <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-4">
            <div className="lg:col-span-3">
              <PlaygroundCtaTile />
            </div>
            <div className="flex flex-col gap-2 lg:col-span-1">
              <StatCard
                className="flex-1"
                contentClassName="text-4xl"
                label="Total spent USD"
                tooltip={USD_DENOM.totalTooltip}
                content={
                  <>
                    {USD_DENOM.formatTotal(udenomToDenom(dashboardData.now.totalUUsdSpent))}
                    <DiffPercentageChip value={percIncrease(dashboardData.compare.totalUUsdSpent, dashboardData.now.totalUUsdSpent)} />
                  </>
                }
              />
              <StatCard
                className="flex-1"
                contentClassName="text-4xl"
                label="USD Spent (24h)"
                tooltip="Amount spent in the last 24h (ACT + AKT converted to USD)."
                content={
                  <>
                    {USD_DENOM.formatAmount(udenomToDenom(dashboardData.now.dailyUUsdSpent))}
                    <DiffPercentageChip value={percIncrease(dashboardData.compare.dailyUUsdSpent, dashboardData.now.dailyUUsdSpent)} />
                  </>
                }
              />
            </div>
          </div>

          <div className="mt-2">
            <NetworkCapacitySummary networkCapacity={dashboardData.networkCapacity} />
          </div>

          <div className="mt-2 grid gap-2 md:grid-cols-2">
            <LeasesTrendContainer />
            <BecomeProviderTile />
          </div>

          <div className="mt-2">
            <GpuTrendsContainer totalGPU={dashboardData.networkCapacity.totalGPU} />
          </div>

          <div className="mt-2">
            <GlobalGridContainer />
          </div>
        </>
      )}

      <div className="mt-2">
        <BottomCta />
      </div>
    </>
  );
};
