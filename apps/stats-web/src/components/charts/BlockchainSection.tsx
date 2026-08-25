"use client";
import type { FC } from "react";
import { FormattedNumber } from "react-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@akashnetwork/ui/components";

import { AKTLabel } from "@/components/AKTLabel";
import { BlocksTable } from "@/components/blockchain/BlocksTable";
import { TransactionsTable } from "@/components/blockchain/TransactionsTable";
import SearchBar from "@/components/SearchBar";
import { StatCardRow } from "@/components/StatCardRow";
import { udenomToDenom } from "@/lib/mathHelpers";
import type { DashboardData } from "@/types";

export const DEPENDENCIES = { BlocksTable, TransactionsTable, SearchBar };

export type BlockchainSectionProps = {
  chainStats: DashboardData["chainStats"];
  dependencies?: typeof DEPENDENCIES;
};

export const BlockchainSection: FC<BlockchainSectionProps> = ({ chainStats, dependencies: d = DEPENDENCIES }) => (
  <div className="flex flex-col gap-6">
    <StatCardRow
      className="sm:grid-cols-3"
      items={[
        { key: "height", label: "Height", content: <FormattedNumber value={chainStats.height} /> },
        { key: "transactions", label: "Transactions", content: <FormattedNumber value={chainStats.transactionCount} /> },
        {
          key: "community-pool",
          label: "Community Pool",
          content: (
            <>
              <FormattedNumber value={udenomToDenom(chainStats.communityPool)} notation="compact" maximumFractionDigits={2} />
              <AKTLabel />
            </>
          )
        },
        {
          key: "bonded-tokens",
          label: "Bonded Tokens",
          content: (
            <>
              <FormattedNumber value={udenomToDenom(chainStats.bondedTokens)} notation="compact" maximumFractionDigits={2} />
              <AKTLabel />
            </>
          )
        },
        {
          key: "inflation",
          label: "Inflation",
          content: <FormattedNumber value={chainStats.inflation} style="percent" minimumFractionDigits={2} maximumFractionDigits={2} />
        },
        ...(chainStats.stakingAPR !== undefined
          ? [
              {
                key: "staking-apr",
                label: "Staking APR",
                content: <FormattedNumber value={chainStats.stakingAPR} style="percent" minimumFractionDigits={2} maximumFractionDigits={2} />
              }
            ]
          : [])
      ]}
    />

    <Tabs defaultValue="blocks">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList className="bg-muted">
          <TabsTrigger value="blocks" className="px-2 py-1">
            Blocks
          </TabsTrigger>
          <TabsTrigger value="transactions" className="px-2 py-1">
            Transactions
          </TabsTrigger>
        </TabsList>

        <div className="w-full sm:w-[280px]">
          <d.SearchBar />
        </div>
      </div>

      <TabsContent value="blocks" className="mt-4">
        <d.BlocksTable />
      </TabsContent>

      <TabsContent value="transactions" className="mt-4">
        <d.TransactionsTable />
      </TabsContent>
    </Tabs>
  </div>
);
