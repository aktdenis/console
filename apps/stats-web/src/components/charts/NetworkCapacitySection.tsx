import type { FC } from "react";

import { EcosystemConstellationContainer } from "@/components/charts/EcosystemConstellation/EcosystemConstellationContainer";
import { GlobalGridContainer } from "@/components/charts/GlobalGrid/GlobalGridContainer";
import { MedianUptimeCardContainer } from "@/components/charts/GlobalGrid/MedianUptimeCardContainer";
import { NetworkCapacityBubbles } from "@/components/charts/GlobalGrid/NetworkCapacityBubbles";
import { NetworkCapacityTable } from "@/components/charts/GlobalGrid/NetworkCapacityTable";
import { PowerCapacityContainer } from "@/components/charts/GlobalGrid/PowerCapacityContainer";
import { NetworkProviderCta } from "@/components/charts/NetworkProviderCta";
import type { SpendChartViewMode } from "@/components/charts/SpendChart/SpendChart";
import { computeNetworkCapacityRows } from "@/lib/networkCapacityRows";
import type { NetworkCapacity } from "@/types";

export const DEPENDENCIES = {
  MedianUptimeCardContainer,
  NetworkCapacityBubbles,
  NetworkCapacityTable,
  PowerCapacityContainer,
  GlobalGridContainer,
  EcosystemConstellationContainer,
  NetworkProviderCta
};

export type NetworkCapacitySectionProps = {
  networkCapacity: NetworkCapacity;
  viewMode?: SpendChartViewMode;
  dependencies?: typeof DEPENDENCIES;
};

export const NetworkCapacitySection: FC<NetworkCapacitySectionProps> = ({ networkCapacity, viewMode = "chart", dependencies: d = DEPENDENCIES }) => {
  const rows = computeNetworkCapacityRows(networkCapacity);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-4">
        <d.MedianUptimeCardContainer className="lg:col-span-1" />
        {viewMode === "table" ? (
          <d.NetworkCapacityTable rows={rows} className="lg:col-span-3" />
        ) : (
          <d.NetworkCapacityBubbles rows={rows} className="lg:col-span-3" />
        )}
      </div>
      <d.PowerCapacityContainer />
      <d.GlobalGridContainer />
      <d.EcosystemConstellationContainer />
      <d.NetworkProviderCta />
    </div>
  );
};
