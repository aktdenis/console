"use client";
import React from "react";

import { BecomeProviderTile } from "./BecomeProviderTile";
import { BottomCta } from "./BottomCta";
import { LiveActivityTicker } from "./LiveActivityTicker";
import { OverviewStatsCarousel } from "./OverviewStatsCarousel";

import { DailySpendChartContainer } from "@/components/charts/DailySpendChart/DailySpendChartContainer";
import { GpuTrendsContainer } from "@/components/charts/GpuTrendsContainer";
import { LeasesTrendContainer } from "@/components/charts/LeasesTrendContainer";
import { NetworkCapacitySection } from "@/components/charts/NetworkCapacitySection";
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
          <div className="mt-6">
            <OverviewStatsCarousel dashboardData={dashboardData} />
          </div>

          <div className="mt-6">
            <DailySpendChartContainer />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <LeasesTrendContainer />
            <BecomeProviderTile />
          </div>

          <div className="mt-6">
            <GpuTrendsContainer totalGPU={dashboardData.networkCapacity.totalGPU} />
          </div>

          <div className="mt-6">
            <NetworkCapacitySection networkCapacity={dashboardData.networkCapacity} />
          </div>
        </>
      )}

      <div className="mt-6">
        <BottomCta />
      </div>
    </>
  );
};
