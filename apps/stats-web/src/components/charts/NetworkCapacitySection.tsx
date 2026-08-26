import type { FC } from "react";

import { GlobalGridContainer } from "@/components/charts/GlobalGrid/GlobalGridContainer";
import type { NetworkCapacity } from "@/types";

export const DEPENDENCIES = { GlobalGridContainer };

export type NetworkCapacitySectionProps = {
  networkCapacity: NetworkCapacity;
  dependencies?: typeof DEPENDENCIES;
};

export const NetworkCapacitySection: FC<NetworkCapacitySectionProps> = ({ networkCapacity, dependencies: d = DEPENDENCIES }) => (
  <d.GlobalGridContainer networkCapacity={networkCapacity} />
);
