"use client";
import type { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@akashnetwork/ui/components";

import { Dashboard } from "./Dashboard";

import { AssetsSpentAktSection } from "@/components/charts/AssetsSpentAktSection";
import { NetworkCapacitySection } from "@/components/charts/NetworkCapacitySection";
import { Title } from "@/components/Title";
import type { DashboardData, MarketData } from "@/types";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "assets-spent", label: "Assets Spent" },
  { value: "network-resources", label: "Network Resources" },
  { value: "resources-leased", label: "Resources Leased" },
  { value: "assets-spent-akt", label: "Assets Spent (AKT)" },
  { value: "bme", label: "BME" },
  { value: "blockchain", label: "Blockchain" }
] as const;

const BUILT_TAB_VALUES = ["overview", "network-resources", "assets-spent-akt"] as const;

const UPCOMING_TABS = TABS.filter(tab => !BUILT_TAB_VALUES.includes(tab.value as (typeof BUILT_TAB_VALUES)[number]));

export const DEPENDENCIES = { Dashboard, NetworkCapacitySection, AssetsSpentAktSection };

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
      <TabsList className="w-max min-w-full justify-start bg-muted">
        {TABS.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value} className="px-2 py-1">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>

    <TabsContent value="overview">
      <d.Dashboard dashboardData={dashboardData} marketData={marketData} />
    </TabsContent>

    <TabsContent value="network-resources" className="mt-5">
      <Title subTitle className="mb-5 text-3xl font-bold tracking-tight sm:text-3xl">
        Network Capacity
      </Title>
      <d.NetworkCapacitySection networkCapacity={dashboardData.networkCapacity} />
    </TabsContent>

    <TabsContent value="assets-spent-akt" className="mt-5">
      <Title subTitle className="mb-5 text-3xl font-bold tracking-tight sm:text-3xl">
        Assets Spent (AKT)
      </Title>
      <d.AssetsSpentAktSection now={dashboardData.now} compare={dashboardData.compare} />
    </TabsContent>

    {UPCOMING_TABS.map(tab => (
      <TabsContent key={tab.value} value={tab.value}>
        <UpcomingTabPlaceholder label={tab.label} />
      </TabsContent>
    ))}
  </Tabs>
);
