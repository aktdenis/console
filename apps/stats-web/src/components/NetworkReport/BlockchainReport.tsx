import type { FC } from "react";
import { FormattedNumber } from "react-intl";

import { AKTLabel } from "@/components/AKTLabel";
import { BlocksTable } from "@/components/blockchain/BlocksTable";
import { TransactionsTable } from "@/components/blockchain/TransactionsTable";
import { ReportStat } from "@/components/NetworkReport/ReportStat";
import SearchBar from "@/components/SearchBar";
import { udenomToDenom } from "@/lib/mathHelpers";
import type { DashboardData } from "@/types";

export const DEPENDENCIES = { BlocksTable, TransactionsTable, SearchBar };

export type BlockchainReportProps = {
  chainStats: DashboardData["chainStats"];
  dependencies?: typeof DEPENDENCIES;
};

export const BlockchainReport: FC<BlockchainReportProps> = ({ chainStats, dependencies: d = DEPENDENCIES }) => (
  <div className="flex flex-col gap-2">
    <div className="w-full">
      <d.SearchBar />
    </div>

    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Blocks</h3>
        <d.BlocksTable />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Transactions</h3>
        <d.TransactionsTable />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
      <ReportStat label="Height" content={<FormattedNumber value={chainStats.height} />} />
      <ReportStat label="Transactions" content={<FormattedNumber value={chainStats.transactionCount} />} />
      <ReportStat
        label="Community Pool"
        content={
          <>
            <FormattedNumber value={udenomToDenom(chainStats.communityPool)} notation="compact" maximumFractionDigits={2} />
            <AKTLabel />
          </>
        }
      />
      <ReportStat
        label="Bonded Tokens"
        content={
          <>
            <FormattedNumber value={udenomToDenom(chainStats.bondedTokens)} notation="compact" maximumFractionDigits={2} />
            <AKTLabel />
          </>
        }
      />
      <ReportStat
        label="Inflation"
        content={<FormattedNumber value={chainStats.inflation} style="percent" minimumFractionDigits={2} maximumFractionDigits={2} />}
      />
      {chainStats.stakingAPR !== undefined && (
        <ReportStat
          label="Staking APR"
          content={<FormattedNumber value={chainStats.stakingAPR} style="percent" minimumFractionDigits={2} maximumFractionDigits={2} />}
        />
      )}
    </div>
  </div>
);
