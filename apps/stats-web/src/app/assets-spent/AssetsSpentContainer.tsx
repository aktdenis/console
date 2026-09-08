"use client";
import type { FC } from "react";
import { Spinner } from "@akashnetwork/ui/components";

import { BME_LEARN_MORE_RESOURCES } from "@/components/bme/bmeLearnMoreResources";
import { AssetsSpentAktSection } from "@/components/charts/AssetsSpentAktSection";
import { AssetsSpentSection } from "@/components/charts/AssetsSpentSection";
import { StickyBottomNav } from "@/components/layout/StickyBottomNav";
import { LinkTiles } from "@/components/LinkTiles";
import { Title } from "@/components/Title";
import { useDashboardData } from "@/queries/useDashboardData";

export const AssetsSpentContainer: FC = () => {
  const { data: dashboardData, isLoading } = useDashboardData();
  const hasData = dashboardData?.now && dashboardData?.compare;

  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-col gap-1.5">
        <Title className="text-2xl font-semibold">Assets Spent</Title>
        <p className="text-sm text-muted-foreground">USD, AKT, and ACT spend across the network.</p>
      </div>

      {hasData && (
        <div className="flex flex-col gap-2">
          <AssetsSpentSection now={dashboardData.now} compare={dashboardData.compare} />
          <AssetsSpentAktSection now={dashboardData.now} compare={dashboardData.compare} />

          <div>
            <p className="mb-4 text-lg font-semibold tracking-tight text-foreground">Learn more</p>
            <LinkTiles items={BME_LEARN_MORE_RESOURCES} />
          </div>
        </div>
      )}

      {isLoading && !hasData && (
        <div className="flex min-h-[70vh] items-center justify-center">
          <Spinner size="large" />
        </div>
      )}

      <StickyBottomNav />
    </div>
  );
};
