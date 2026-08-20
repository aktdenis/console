import { type FC } from "react";
import { FormattedNumber } from "react-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Progress } from "@akashnetwork/ui/components";

import { bytesToShrink } from "@/lib/unitUtils";
import type { NetworkCapacity } from "@/types";

export const DEPENDENCIES = { Card, CardContent, CardDescription, CardHeader, CardTitle, Progress };

export type NetworkCapacityCardProps = {
  networkCapacity: NetworkCapacity;
  dependencies?: typeof DEPENDENCIES;
};

type UtilizationRow = {
  key: string;
  label: string;
  percent: number;
  activeLabel: React.ReactNode;
  totalLabel: React.ReactNode;
};

export const NetworkCapacityCard: FC<NetworkCapacityCardProps> = ({ networkCapacity, dependencies: d = DEPENDENCIES }) => {
  const memory = bytesToShrink(networkCapacity.activeMemory, true);
  const totalMemory = bytesToShrink(networkCapacity.totalMemory, true);
  const storage = bytesToShrink(networkCapacity.activeStorage, true);
  const totalStorage = bytesToShrink(networkCapacity.totalStorage, true);

  const rows: UtilizationRow[] = [
    {
      key: "vcpu",
      label: "vCPU",
      percent: networkCapacity.activeCPU / networkCapacity.totalCPU,
      activeLabel: <FormattedNumber value={networkCapacity.activeCPU / 1000} maximumFractionDigits={1} />,
      totalLabel: (
        <>
          of <FormattedNumber value={networkCapacity.totalCPU / 1000} maximumFractionDigits={0} /> cores
        </>
      )
    },
    {
      key: "gpu",
      label: "GPU",
      percent: networkCapacity.activeGPU / networkCapacity.totalGPU,
      activeLabel: <FormattedNumber value={networkCapacity.activeGPU} />,
      totalLabel: (
        <>
          of <FormattedNumber value={networkCapacity.totalGPU} /> units
        </>
      )
    },
    {
      key: "memory",
      label: "Memory",
      percent: networkCapacity.activeMemory / networkCapacity.totalMemory,
      activeLabel: <FormattedNumber value={memory.value} maximumFractionDigits={1} />,
      totalLabel: (
        <>
          of <FormattedNumber value={totalMemory.value} maximumFractionDigits={1} /> {totalMemory.unit}
        </>
      )
    },
    {
      key: "storage",
      label: "Storage",
      percent: networkCapacity.activeStorage / networkCapacity.totalStorage,
      activeLabel: <FormattedNumber value={storage.value} maximumFractionDigits={1} />,
      totalLabel: (
        <>
          of <FormattedNumber value={totalStorage.value} maximumFractionDigits={1} /> {totalStorage.unit}
        </>
      )
    }
  ];

  return (
    <d.Card>
      <d.CardHeader className="gap-1.5 space-y-0">
        <d.CardTitle className="text-base">Network Capacity</d.CardTitle>
        <d.CardDescription>Leased versus total advertised capacity</d.CardDescription>
      </d.CardHeader>

      <d.CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map(row => (
          <div key={row.key} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="flex-1 font-medium text-muted-foreground">{row.label}</span>
              <span className="font-semibold text-foreground">
                <FormattedNumber value={row.percent} style="percent" maximumFractionDigits={1} />
              </span>
            </div>
            <div className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-xl font-semibold tracking-tight text-foreground">{row.activeLabel}</span>
              <span className="text-xs text-muted-foreground">{row.totalLabel}</span>
            </div>
            <d.Progress value={row.percent * 100} className="h-1.5" />
          </div>
        ))}
      </d.CardContent>
    </d.Card>
  );
};
