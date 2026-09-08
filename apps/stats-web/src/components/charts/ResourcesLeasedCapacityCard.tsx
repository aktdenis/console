import type { FC } from "react";

import { CapacityLegendCard } from "@/components/charts/GlobalGrid/CapacityLegendCard";
import { UtilizationCard } from "@/components/charts/UtilizationCard";
import { computeLeasedUtilizationRows } from "@/lib/leasedUtilizationRows";
import { computeNetworkCapacityRows } from "@/lib/networkCapacityRows";
import type { DashboardBlockStats, NetworkCapacity } from "@/types";

export const DEPENDENCIES = { UtilizationCard, CapacityLegendCard };

export type ResourcesLeasedCapacityCardProps = {
  now: DashboardBlockStats;
  networkCapacity: NetworkCapacity;
  dependencies?: typeof DEPENDENCIES;
};

export const ResourcesLeasedCapacityCard: FC<ResourcesLeasedCapacityCardProps> = ({ now, networkCapacity, dependencies: d = DEPENDENCIES }) => {
  const rows = computeLeasedUtilizationRows(now, networkCapacity);
  const capacityRows = computeNetworkCapacityRows(networkCapacity);

  return (
    <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-4">
      <d.CapacityLegendCard rows={capacityRows} className="lg:col-span-1" />
      <d.UtilizationCard title="Leased capacity" rows={rows} className="lg:col-span-3" />
    </div>
  );
};
