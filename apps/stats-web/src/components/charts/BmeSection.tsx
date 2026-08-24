"use client";
import type { FC } from "react";
import { Spinner } from "@akashnetwork/ui/components";

import { BmeDashboard } from "@/components/bme/BmeDashboard";
import { useBmeDashboardData, useBmeStatusHistory } from "@/queries";

export const DEPENDENCIES = { BmeDashboard, useBmeDashboardData, useBmeStatusHistory };

export type BmeSectionProps = {
  dependencies?: typeof DEPENDENCIES;
};

export const BmeSection: FC<BmeSectionProps> = ({ dependencies: d = DEPENDENCIES }) => {
  const { data: dashboardData, isLoading: isLoadingDashboard } = d.useBmeDashboardData();
  const { data: statusHistory, isLoading: isLoadingStatusHistory } = d.useBmeStatusHistory();

  const hasData = dashboardData?.now && dashboardData?.compare;

  if (!hasData) {
    return isLoadingDashboard || isLoadingStatusHistory ? (
      <div className="flex items-center justify-center p-4">
        <Spinner size="large" />
      </div>
    ) : null;
  }

  return <d.BmeDashboard dashboardData={dashboardData} statusHistory={statusHistory ?? []} />;
};
