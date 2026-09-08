"use client";
import { Spinner } from "@akashnetwork/ui/components";

import { Dashboard } from "./Dashboard";

import { StickyBottomNav } from "@/components/layout/StickyBottomNav";
import { useMarketData } from "@/queries";
import { useDashboardData } from "@/queries/useDashboardData";

export const DashboardContainer: React.FunctionComponent = () => {
  const { data: dashboardData, isLoading: isLoadingDashboardData } = useDashboardData();
  const { data: marketData, isLoading: isLoadingMarketData } = useMarketData();
  const isLoading = isLoadingMarketData || isLoadingDashboardData;

  return (
    <div className="mt-0">
      {dashboardData && marketData && <Dashboard dashboardData={dashboardData} marketData={marketData} />}

      {isLoading && !dashboardData && (
        <div className="flex min-h-[70vh] items-center justify-center">
          <Spinner size="large" />
        </div>
      )}

      <StickyBottomNav />
    </div>
  );
};
