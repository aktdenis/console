"use client";
import type { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@akashnetwork/ui/components";

import { Dashboard } from "./Dashboard";

import { BME_LEARN_MORE_RESOURCES } from "@/components/bme/bmeLearnMoreResources";
import { AssetsSpentAktSection } from "@/components/charts/AssetsSpentAktSection";
import { AssetsSpentSection } from "@/components/charts/AssetsSpentSection";
import { BmeSection } from "@/components/charts/BmeSection";
import { LeasesSection } from "@/components/charts/LeasesSection";
import { NetworkCapacitySection } from "@/components/charts/NetworkCapacitySection";
import { ResourcesLeasedCapacityCard } from "@/components/charts/ResourcesLeasedCapacityCard";
import { ResourcesLeasedSection } from "@/components/charts/ResourcesLeasedSection";
import { LinkTiles } from "@/components/LinkTiles";
import { Title } from "@/components/Title";
import type { DashboardData, MarketData } from "@/types";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "assets-spent", label: "Assets Spent" },
  { value: "network-resources", label: "Network Resources" },
  { value: "resources-leased", label: "Resources Leased" },
  { value: "bme", label: "BME" },
  { value: "blockchain", label: "Blockchain" }
] as const;

const BUILT_TAB_VALUES = ["overview", "assets-spent", "network-resources", "resources-leased", "bme"] as const;

const UPCOMING_TABS = TABS.filter(tab => !BUILT_TAB_VALUES.includes(tab.value as (typeof BUILT_TAB_VALUES)[number]));

export const DEPENDENCIES = {
  Dashboard,
  NetworkCapacitySection,
  AssetsSpentAktSection,
  AssetsSpentSection,
  BmeSection,
  LeasesSection,
  ResourcesLeasedCapacityCard,
  ResourcesLeasedSection
};

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

    <TabsContent value="assets-spent" className="mt-5">
      <Title subTitle className="mb-5 text-3xl font-bold tracking-tight sm:text-3xl">
        Assets Spent (USD)
      </Title>
      <d.AssetsSpentSection now={dashboardData.now} compare={dashboardData.compare} />

      <Title subTitle className="mb-5 mt-8 text-3xl font-bold tracking-tight sm:text-3xl">
        Assets Spent (AKT&ACT)
      </Title>
      <d.AssetsSpentAktSection now={dashboardData.now} compare={dashboardData.compare} />

      <p className="mb-4 mt-8 text-lg font-semibold tracking-tight text-foreground">Learn more</p>
      <LinkTiles items={BME_LEARN_MORE_RESOURCES} />
    </TabsContent>

    <TabsContent value="network-resources" className="mt-5">
      <Title subTitle className="mb-5 text-3xl font-bold tracking-tight sm:text-3xl">
        Network Capacity
      </Title>
      <d.NetworkCapacitySection networkCapacity={dashboardData.networkCapacity} />
    </TabsContent>

    <TabsContent value="resources-leased" className="mt-5">
      <Title subTitle className="mb-5 text-3xl font-bold tracking-tight sm:text-3xl">
        Resources Leased
      </Title>
      <d.ResourcesLeasedCapacityCard now={dashboardData.now} networkCapacity={dashboardData.networkCapacity} />

      <Title subTitle className="mb-5 mt-8 text-3xl font-bold tracking-tight sm:text-3xl">
        Leases
      </Title>
      <d.LeasesSection now={dashboardData.now} compare={dashboardData.compare} />

      <Title subTitle className="mb-5 mt-8 text-3xl font-bold tracking-tight sm:text-3xl">
        Resource Usage
      </Title>
      <d.ResourcesLeasedSection now={dashboardData.now} compare={dashboardData.compare} />
    </TabsContent>

    <TabsContent value="bme" className="mt-5">
      <d.BmeSection />
    </TabsContent>

    {UPCOMING_TABS.map(tab => (
      <TabsContent key={tab.value} value={tab.value}>
        <UpcomingTabPlaceholder label={tab.label} />
      </TabsContent>
    ))}
  </Tabs>
);
