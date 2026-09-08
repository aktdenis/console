import type { FC } from "react";

import { CapacityLegendCard } from "@/components/charts/GlobalGrid/CapacityLegendCard";
import { NetworkCapacityBubbles } from "@/components/charts/GlobalGrid/NetworkCapacityBubbles";
import { computeNetworkCapacityRows } from "@/lib/networkCapacityRows";
import type { NetworkCapacity } from "@/types";

export type NetworkCapacitySummaryProps = {
  networkCapacity: NetworkCapacity;
};

export const NetworkCapacitySummary: FC<NetworkCapacitySummaryProps> = ({ networkCapacity }) => {
  const rows = computeNetworkCapacityRows(networkCapacity);

  return (
    <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-4">
      <CapacityLegendCard rows={rows} className="lg:col-span-1" />
      <NetworkCapacityBubbles rows={rows} className="lg:col-span-3" />
    </div>
  );
};
