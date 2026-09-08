import type { FC } from "react";

import { NetworkCapacityTable } from "@/components/charts/GlobalGrid/NetworkCapacityTable";
import { GpuPriceListContainer } from "@/components/charts/GpuPriceList/GpuPriceListContainer";
import { UtilizationCard } from "@/components/charts/UtilizationCard";
import { computeLeasedUtilizationRows } from "@/lib/leasedUtilizationRows";
import { computeNetworkCapacityRows } from "@/lib/networkCapacityRows";
import type { DashboardBlockStats, NetworkCapacity } from "@/types";

export const DEPENDENCIES = { GpuPriceListContainer, UtilizationCard, NetworkCapacityTable };

export type ReferenceTablesSectionProps = {
  now: DashboardBlockStats;
  networkCapacity: NetworkCapacity;
  showGpuPricing: boolean;
  showLeasedCapacity: boolean;
  showNetworkCapacity: boolean;
  dependencies?: typeof DEPENDENCIES;
};

export const ReferenceTablesSection: FC<ReferenceTablesSectionProps> = ({
  now,
  networkCapacity,
  showGpuPricing,
  showLeasedCapacity,
  showNetworkCapacity,
  dependencies: d = DEPENDENCIES
}) => (
  <div className="flex flex-col gap-2">
    {showGpuPricing && <d.GpuPriceListContainer />}
    {showLeasedCapacity && <d.UtilizationCard title="Leased capacity" rows={computeLeasedUtilizationRows(now, networkCapacity)} />}
    {showNetworkCapacity && <d.NetworkCapacityTable rows={computeNetworkCapacityRows(networkCapacity)} />}
  </div>
);
