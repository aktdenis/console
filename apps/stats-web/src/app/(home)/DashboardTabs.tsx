"use client";
import type { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@akashnetwork/ui/components";

import { Dashboard } from "./Dashboard";

import { AssetsSpentAktSection } from "@/components/charts/AssetsSpentAktSection";
import { AssetsSpentSection } from "@/components/charts/AssetsSpentSection";
import { LeasesSection } from "@/components/charts/LeasesSection";
import { NetworkCapacitySection } from "@/components/charts/NetworkCapacitySection";
import { ResourcesLeasedCapacityCard } from "@/components/charts/ResourcesLeasedCapacityCard";
import { ResourcesLeasedSection } from "@/components/charts/ResourcesLeasedSection";
import { LinkTiles } from "@/components/LinkTiles";
import { Title } from "@/components/Title";
import type { DashboardData, MarketData } from "@/types";

const ASSETS_SPENT_RESOURCES = [
  {
    key: "bme-blog",
    eyebrow: "Blog",
    title: "What Burn-Mint Equilibrium Means for Akash",
    body: "How burning AKT to mint ACT gives tenants stable USD pricing while creating deflationary demand for AKT.",
    cta: "Read the post",
    href: "https://akash.network/blog/what-burn-mint-equilibrium-means-for-akash/"
  },
  {
    key: "bme-roadmap",
    eyebrow: "Roadmap · AEP-76",
    title: "Burn Mint Equilibrium On Akash",
    body: "The proposal behind BME: a compute credit token that burns AKT to mint and burns again on settlement. Status: Final.",
    cta: "View the proposal",
    href: "https://akash.network/roadmap/aep-76/"
  }
] as const;

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "assets-spent", label: "Assets Spent" },
  { value: "network-resources", label: "Network Resources" },
  { value: "resources-leased", label: "Resources Leased" },
  { value: "bme", label: "BME" },
  { value: "blockchain", label: "Blockchain" }
] as const;

const BUILT_TAB_VALUES = ["overview", "assets-spent", "network-resources", "resources-leased"] as const;

const UPCOMING_TABS = TABS.filter(tab => !BUILT_TAB_VALUES.includes(tab.value as (typeof BUILT_TAB_VALUES)[number]));

export const DEPENDENCIES = {
  Dashboard,
  NetworkCapacitySection,
  AssetsSpentAktSection,
  AssetsSpentSection,
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
      <LinkTiles items={ASSETS_SPENT_RESOURCES} />
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

    {UPCOMING_TABS.map(tab => (
      <TabsContent key={tab.value} value={tab.value}>
        <UpcomingTabPlaceholder label={tab.label} />
      </TabsContent>
    ))}
  </Tabs>
);
