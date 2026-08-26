"use client";
import { type FC, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@akashnetwork/ui/components";

import { Dashboard } from "./Dashboard";

import { BME_LEARN_MORE_RESOURCES } from "@/components/bme/bmeLearnMoreResources";
import { AssetsSpentAktSection } from "@/components/charts/AssetsSpentAktSection";
import { AssetsSpentSection } from "@/components/charts/AssetsSpentSection";
import { BlockchainSection } from "@/components/charts/BlockchainSection";
import { BmeSection } from "@/components/charts/BmeSection";
import { EcosystemSection } from "@/components/charts/EcosystemSection";
import { LeasesSection } from "@/components/charts/LeasesSection";
import { NetworkCapacitySection } from "@/components/charts/NetworkCapacitySection";
import { ResourcesLeasedCapacityCard } from "@/components/charts/ResourcesLeasedCapacityCard";
import { ResourcesLeasedSection } from "@/components/charts/ResourcesLeasedSection";
import { LinkTiles } from "@/components/LinkTiles";
import { Title } from "@/components/Title";
import { RESET_TO_OVERVIEW_EVENT } from "@/lib/dashboardTabEvents";
import type { DashboardData, MarketData } from "@/types";

/** The floating tab bar's permanent gap from the viewport bottom. */
const TAB_BAR_BOTTOM_GAP_PX = 30;

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "assets-spent", label: "Assets Spent" },
  { value: "network-resources", label: "Network Resources" },
  { value: "resources-leased", label: "Resources Leased" },
  { value: "bme", label: "BME" },
  { value: "blockchain", label: "Blockchain" },
  { value: "ecosystem", label: "Provider Network" }
] as const;

export const DEPENDENCIES = {
  Dashboard,
  NetworkCapacitySection,
  AssetsSpentAktSection,
  AssetsSpentSection,
  BlockchainSection,
  BmeSection,
  EcosystemSection,
  LeasesSection,
  ResourcesLeasedCapacityCard,
  ResourcesLeasedSection
};

export type DashboardTabsProps = {
  dashboardData: DashboardData;
  marketData: MarketData;
  dependencies?: typeof DEPENDENCIES;
};

export const DashboardTabs: FC<DashboardTabsProps> = ({ dashboardData, marketData, dependencies: d = DEPENDENCIES }) => {
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [resetCount, setResetCount] = useState(0);

  useEffect(() => {
    function resetToOverview() {
      setResetCount(count => count + 1);
      window.scrollTo({ top: 0 });
    }

    window.addEventListener(RESET_TO_OVERVIEW_EVENT, resetToOverview);
    return () => window.removeEventListener(RESET_TO_OVERVIEW_EVENT, resetToOverview);
  }, []);

  useEffect(() => {
    const tabsList = tabsListRef.current;
    const footer = document.querySelector("footer");
    if (!tabsList || !footer) return;

    const previousFooterPaddingBottom = footer.style.paddingBottom;

    function reserveFooterSpace() {
      if (!tabsList || !footer) return;
      footer.style.paddingBottom = `${tabsList.getBoundingClientRect().height + TAB_BAR_BOTTOM_GAP_PX}px`;
    }

    reserveFooterSpace();
    const resizeObserver = new ResizeObserver(reserveFooterSpace);
    resizeObserver.observe(tabsList);

    return () => {
      resizeObserver.disconnect();
      footer.style.paddingBottom = previousFooterPaddingBottom;
    };
  }, []);

  return (
    <Tabs key={resetCount} defaultValue="overview" onValueChange={() => window.scrollTo({ top: 0 })} className="relative flex flex-col">
      <TabsList
        ref={tabsListRef}
        className="fixed left-1/2 z-50 order-last flex w-fit max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 overflow-x-auto rounded-xl bg-[rgba(34,34,34,0.85)] p-3 shadow-lg backdrop-blur"
        style={{ bottom: TAB_BAR_BOTTOM_GAP_PX }}
      >
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

      <TabsContent value="overview" className="mt-0">
        <d.Dashboard dashboardData={dashboardData} marketData={marketData} />
      </TabsContent>

      <TabsContent value="assets-spent" className="mt-0">
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

      <TabsContent value="network-resources" className="mt-0">
        <Title subTitle className="mb-5 text-3xl font-bold tracking-tight sm:text-3xl">
          Network Capacity
        </Title>
        <d.NetworkCapacitySection networkCapacity={dashboardData.networkCapacity} />
      </TabsContent>

      <TabsContent value="resources-leased" className="mt-0">
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

      <TabsContent value="bme" className="mt-0">
        <d.BmeSection />
      </TabsContent>

      <TabsContent value="blockchain" className="mt-0">
        <Title subTitle className="mb-5 text-3xl font-bold tracking-tight sm:text-3xl">
          Blockchain
        </Title>
        <d.BlockchainSection chainStats={dashboardData.chainStats} />
      </TabsContent>

      <TabsContent value="ecosystem" className="-mt-4">
        <d.EcosystemSection />
      </TabsContent>
    </Tabs>
  );
};
