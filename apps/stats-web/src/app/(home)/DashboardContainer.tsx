"use client";
import { Spinner } from "@akashnetwork/ui/components";

import { DashboardTabs } from "./DashboardTabs";

import { useMarketData } from "@/queries";
import { useDashboardData } from "@/queries/useDashboardData";

export const DashboardContainer: React.FunctionComponent = () => {
  const { data: dashboardData, isLoading: isLoadingDashboardData } = useDashboardData();
  const { data: marketData, isLoading: isLoadingMarketData } = useMarketData();
  const isLoading = isLoadingMarketData || isLoadingDashboardData;

  return (
    <div className="mt-8">
      {dashboardData && marketData && <DashboardTabs dashboardData={dashboardData} marketData={marketData} />}

      {isLoading && !dashboardData && (
        <div className="flex items-center justify-center p-4">
          <Spinner size="large" />
        </div>
      )}
    </div>
  );
};
