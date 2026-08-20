import { type FC, type ReactNode } from "react";
import { FormattedNumber } from "react-intl";
import { Card } from "@akashnetwork/ui/components";

import { udenomToDenom } from "@/lib/mathHelpers";

export type ChainStripProps = {
  chainStats: {
    height: number;
    transactionCount: number;
    bondedTokens: number;
    totalSupply: number;
    stakingAPR?: number;
    inflation: number;
    communityPool: number;
  };
  totalUUsdSpent: number;
  totalLeaseCount: number;
};

type ChainStatItem = {
  key: string;
  label: string;
  value: ReactNode;
  caption?: ReactNode;
};

export const ChainStrip: FC<ChainStripProps> = ({ chainStats, totalUUsdSpent, totalLeaseCount }) => {
  const items: ChainStatItem[] = [
    { key: "height", label: "Block height", value: <FormattedNumber value={chainStats.height} /> },
    { key: "transactions", label: "Transactions", value: <FormattedNumber value={chainStats.transactionCount} /> },
    {
      key: "bonded",
      label: "Bonded",
      value: (
        <>
          <FormattedNumber value={udenomToDenom(chainStats.bondedTokens)} notation="compact" maximumFractionDigits={2} /> AKT
        </>
      ),
      caption: (
        <>
          <FormattedNumber value={chainStats.bondedTokens / chainStats.totalSupply} style="percent" maximumFractionDigits={1} /> of{" "}
          <FormattedNumber value={udenomToDenom(chainStats.totalSupply)} notation="compact" maximumFractionDigits={2} />
        </>
      )
    },
    ...(chainStats.stakingAPR !== undefined
      ? [
          {
            key: "apr",
            label: "Staking APR",
            value: <FormattedNumber value={chainStats.stakingAPR} style="percent" minimumFractionDigits={2} maximumFractionDigits={2} />,
            caption: (
              <>
                <FormattedNumber value={chainStats.inflation} style="percent" minimumFractionDigits={2} maximumFractionDigits={2} /> inflation
              </>
            )
          }
        ]
      : []),
    {
      key: "community-pool",
      label: "Community pool",
      value: (
        <>
          <FormattedNumber value={udenomToDenom(chainStats.communityPool)} notation="compact" maximumFractionDigits={2} /> AKT
        </>
      )
    },
    {
      key: "all-time-spend",
      label: "All-time spend",
      value: <FormattedNumber value={udenomToDenom(totalUUsdSpent)} style="currency" currency="USD" notation="compact" maximumFractionDigits={2} />,
      caption: (
        <>
          <FormattedNumber value={totalLeaseCount} /> leases
        </>
      )
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {items.map(item => (
        <Card key={item.key} className="flex flex-col gap-1 p-4">
          <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
          <span className="text-lg font-semibold tracking-tight text-foreground">{item.value}</span>
          {item.caption && <span className="text-[10px] text-muted-foreground">{item.caption}</span>}
        </Card>
      ))}
    </div>
  );
};
