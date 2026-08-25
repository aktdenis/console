"use client";
import type { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@akashnetwork/ui/components";

import { Dashboard } from "./Dashboard";

import { BME_LEARN_MORE_RESOURCES } from "@/components/bme/bmeLearnMoreResources";
import { AssetsSpentAktSection } from "@/components/charts/AssetsSpentAktSection";
import { AssetsSpentSection } from "@/components/charts/AssetsSpentSection";
import { BlockchainSection } from "@/components/charts/BlockchainSection";
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

export const DEPENDENCIES = {
  Dashboard,
  NetworkCapacitySection,
  AssetsSpentAktSection,
  AssetsSpentSection,
  BlockchainSection,
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

export const DashboardTabs: FC<DashboardTabsProps> = ({ dashboardData, marketData, dependencies: d = DEPENDENCIES }) => (
  <Tabs defaultValue="overview" className="relative flex flex-col">
    <TabsList className="sticky bottom-[30px] z-50 order-last mx-auto mt-6 flex w-fit max-w-[calc(100vw-2rem)] items-center gap-2 overflow-x-auto rounded-xl bg-[rgba(34,34,34,0.85)] p-3 shadow-lg backdrop-blur">
      {TABS.map(tab => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="shrink-0 whitespace-nowrap rounded-lg border border-[rgb(78,78,78)] px-3 py-1.5 text-[13px] text-[rgb(222,222,222)] transition-colors data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>

    <TabsContent value="overview" className="mt-5">
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

    <TabsContent value="blockchain" className="mt-5">
      <Title subTitle className="mb-5 text-3xl font-bold tracking-tight sm:text-3xl">
        Blockchain
      </Title>
      <d.BlockchainSection chainStats={dashboardData.chainStats} />
    </TabsContent>
  </Tabs>
);
