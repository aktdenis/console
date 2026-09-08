"use client";
import type { FC } from "react";
import { Spinner } from "@akashnetwork/ui/components";

import { BlockchainSection } from "@/components/charts/BlockchainSection";
import { StickyBottomNav } from "@/components/layout/StickyBottomNav";
import { Title } from "@/components/Title";
import { useDashboardData } from "@/queries/useDashboardData";

export const BlockchainContainer: FC = () => {
  const { data: dashboardData, isLoading } = useDashboardData();
  const hasData = dashboardData?.chainStats;

  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-col gap-1.5">
        <Title className="text-2xl font-semibold">Blockchain</Title>
        <p className="text-sm text-muted-foreground">Blocks, transactions, and chain-level statistics.</p>
      </div>

      {hasData && <BlockchainSection chainStats={dashboardData.chainStats} />}

      {isLoading && !hasData && (
        <div className="flex min-h-[70vh] items-center justify-center">
          <Spinner size="large" />
        </div>
      )}

      <StickyBottomNav />
    </div>
  );
};
