"use client";
import type { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@akashnetwork/ui/components";

import { Dashboard } from "./Dashboard";

import { NetworkCapacitySection } from "@/components/charts/NetworkCapacitySection";
import { Title } from "@/components/Title";
import type { DashboardData, MarketData } from "@/types";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "asset-spent", label: "Asset Spent" },
  { value: "network-resources", label: "Network Resources" },
  { value: "resources-leased", label: "Resources Leased" },
  { value: "assets-spent-akt", label: "Assets Spent (AKT)" },
  { value: "bme", label: "BME" },
  { value: "blockchain", label: "Blockchain" }
] as const;

const UPCOMING_TABS = TABS.filter(tab => tab.value !== "overview" && tab.value !== "network-resources");

export const DEPENDENCIES = { Dashboard, NetworkCapacitySection };

export type DashboardTabsProps = {
  dashboardData: DashboardData;
  marketData: MarketData;
  dependencies?: typeof DEPENDENCIES;
};

const UpcomingTabPlaceholder: FC<{ label: string }> = ({ label }) => (
  <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-12 text-center">
    <p className="text-sm font-medium text-foreground">{label}</p>
    <p className="text-sm text-muted-foreground">This section is being rebuilt to match the updated design. Check back soon.</p>
  </div>
);

export const DashboardTabs: FC<DashboardTabsProps> = ({ dashboardData, marketData, dependencies: d = DEPENDENCIES }) => (
  <Tabs defaultValue="overview">
    <div className="overflow-x-auto">
      <TabsList className="w-max min-w-full justify-start">
        {TABS.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>

    <TabsContent value="overview">
      <d.Dashboard dashboardData={dashboardData} marketData={marketData} />
    </TabsContent>

    <TabsContent value="network-resources">
      <Title subTitle className="mb-4">
        Network Capacity
      </Title>
      <d.NetworkCapacitySection networkCapacity={dashboardData.networkCapacity} />
    </TabsContent>

    {UPCOMING_TABS.map(tab => (
      <TabsContent key={tab.value} value={tab.value}>
        <UpcomingTabPlaceholder label={tab.label} />
      </TabsContent>
    ))}
  </Tabs>
);
