"use client";
import type { FC } from "react";

import { PowerCapacityTile } from "@/components/charts/GlobalGrid/PowerCapacityTile";
import { estimateGpuPowerCapacityMW } from "@/lib/gpuPowerCapacity";
import { cn } from "@/lib/utils";
import { useGpuPrices } from "@/queries";

export type PowerCapacityContainerProps = {
  className?: string;
};

export const PowerCapacityContainer: FC<PowerCapacityContainerProps> = ({ className }) => {
  const { data } = useGpuPrices();
  const estimate = data ? estimateGpuPowerCapacityMW(data.models) : null;

  return (
    <div className={cn("grid grid-cols-1 gap-2 sm:grid-cols-2", className)}>
      <PowerCapacityTile
        title="Estimated GPU power capacity"
        valueMW={estimate?.totalMW ?? null}
        caption="Estimated from published GPU power specs, not metered consumption."
      />
      <PowerCapacityTile title="GPU power in active leases" valueMW={estimate?.activeMW ?? null} caption="Currently drawn by leased GPUs (estimate)." />
    </div>
  );
};
