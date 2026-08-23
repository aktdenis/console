import type { FC } from "react";
import { FormattedNumber } from "react-intl";

import { UtilizationCard, type UtilizationRow } from "@/components/charts/UtilizationCard";
import { bytesToShrink } from "@/lib/unitUtils";
import type { DashboardBlockStats, NetworkCapacity } from "@/types";

export const DEPENDENCIES = { UtilizationCard };

export type ResourcesLeasedCapacityCardProps = {
  now: DashboardBlockStats;
  networkCapacity: NetworkCapacity;
  dependencies?: typeof DEPENDENCIES;
};

export const ResourcesLeasedCapacityCard: FC<ResourcesLeasedCapacityCardProps> = ({ now, networkCapacity, dependencies: d = DEPENDENCIES }) => {
  const memory = bytesToShrink(now.activeMemory, true);
  const totalMemory = bytesToShrink(networkCapacity.totalMemory, true);
  const storage = bytesToShrink(now.activeStorage, true);
  const totalStorage = bytesToShrink(networkCapacity.totalStorage, true);

  const rows: UtilizationRow[] = [
    {
      key: "vcpu",
      label: "vCPU",
      percent: now.activeCPU / networkCapacity.totalCPU,
      activeLabel: <FormattedNumber value={now.activeCPU / 1000} maximumFractionDigits={1} />,
      totalLabel: (
        <>
          of <FormattedNumber value={networkCapacity.totalCPU / 1000} maximumFractionDigits={0} /> cores
        </>
      )
    },
    {
      key: "gpu",
      label: "GPU",
      percent: now.activeGPU / networkCapacity.totalGPU,
      activeLabel: <FormattedNumber value={now.activeGPU} />,
      totalLabel: (
        <>
          of <FormattedNumber value={networkCapacity.totalGPU} /> units
        </>
      )
    },
    {
      key: "memory",
      label: "Memory",
      percent: now.activeMemory / networkCapacity.totalMemory,
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
      percent: now.activeStorage / networkCapacity.totalStorage,
      activeLabel: <FormattedNumber value={storage.value} maximumFractionDigits={1} />,
      totalLabel: (
        <>
          of <FormattedNumber value={totalStorage.value} maximumFractionDigits={1} /> {totalStorage.unit}
        </>
      )
    }
  ];

  return <d.UtilizationCard description="Leased versus total network capacity" rows={rows} />;
};
