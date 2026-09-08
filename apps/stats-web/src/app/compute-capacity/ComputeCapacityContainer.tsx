"use client";
import type { FC } from "react";
import { Spinner } from "@akashnetwork/ui/components";

import { NetworkCapacitySection } from "@/components/charts/NetworkCapacitySection";
import { StickyBottomNav } from "@/components/layout/StickyBottomNav";
import { Title } from "@/components/Title";
import { useDashboardData } from "@/queries/useDashboardData";

export const ComputeCapacityContainer: FC = () => {
  const { data: dashboardData, isLoading } = useDashboardData();
  const hasData = dashboardData?.networkCapacity;

  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-col gap-1.5">
        <Title className="text-2xl font-semibold">Compute Capacity</Title>
        <p className="text-sm text-muted-foreground">Total network capacity across CPU, GPU, memory, and storage.</p>
      </div>

      {hasData && <NetworkCapacitySection networkCapacity={dashboardData.networkCapacity} />}

      {isLoading && !hasData && (
        <div className="flex min-h-[70vh] items-center justify-center">
          <Spinner size="large" />
        </div>
      )}

      <StickyBottomNav />
    </div>
  );
};
