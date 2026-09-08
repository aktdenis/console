"use client";
import type { FC } from "react";
import { Spinner } from "@akashnetwork/ui/components";

import { LeasesSection } from "@/components/charts/LeasesSection";
import { ResourcesLeasedCapacityCard } from "@/components/charts/ResourcesLeasedCapacityCard";
import { ResourcesLeasedSection } from "@/components/charts/ResourcesLeasedSection";
import { StickyBottomNav } from "@/components/layout/StickyBottomNav";
import { Title } from "@/components/Title";
import { useDashboardData } from "@/queries/useDashboardData";

export const ComputeLeasedContainer: FC = () => {
  const { data: dashboardData, isLoading } = useDashboardData();
  const hasData = dashboardData?.now && dashboardData?.compare;

  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-col gap-1.5">
        <Title className="text-2xl font-semibold">Compute Leased</Title>
        <p className="text-sm text-muted-foreground">Capacity currently leased by tenants, and how it has trended over time.</p>
      </div>

      {hasData && (
        <div className="flex flex-col gap-2">
          <ResourcesLeasedCapacityCard now={dashboardData.now} networkCapacity={dashboardData.networkCapacity} />
          <LeasesSection now={dashboardData.now} compare={dashboardData.compare} />
          <ResourcesLeasedSection now={dashboardData.now} compare={dashboardData.compare} />
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
