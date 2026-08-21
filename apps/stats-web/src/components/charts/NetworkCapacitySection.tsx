import type { FC } from "react";

import { GlobalGridContainer } from "@/components/charts/GlobalGrid/GlobalGridContainer";
import { NetworkCapacityCard } from "@/components/charts/NetworkCapacityCard";
import type { NetworkCapacity } from "@/types";

export const DEPENDENCIES = { GlobalGridContainer, NetworkCapacityCard };

export type NetworkCapacitySectionProps = {
  networkCapacity: NetworkCapacity;
  dependencies?: typeof DEPENDENCIES;
};

export const NetworkCapacitySection: FC<NetworkCapacitySectionProps> = ({ networkCapacity, dependencies: d = DEPENDENCIES }) => (
  <>
    <d.GlobalGridContainer
      stats={{
        activeProviderCount: networkCapacity.activeProviderCount,
        totalCPU: networkCapacity.totalCPU,
        totalGPU: networkCapacity.totalGPU,
        totalMemory: networkCapacity.totalMemory,
        totalStorage: networkCapacity.totalStorage
      }}
    />

    <div className="mt-6">
      <d.NetworkCapacityCard networkCapacity={networkCapacity} />
    </div>
  </>
);
