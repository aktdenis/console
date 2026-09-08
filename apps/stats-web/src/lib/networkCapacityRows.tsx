import { FormattedNumber } from "react-intl";

import type { CapacityBubbleRow } from "@/components/charts/GlobalGrid/NetworkCapacityBubbles";
import { bytesToShrink } from "@/lib/unitUtils";
import type { NetworkCapacity } from "@/types";

export function computeNetworkCapacityRows(networkCapacity: NetworkCapacity): CapacityBubbleRow[] {
  const totalMemory = bytesToShrink(networkCapacity.totalMemory, true);
  const totalStorage = bytesToShrink(networkCapacity.totalStorage, true);

  return [
    {
      key: "vcpu",
      label: "vCPU",
      percent: networkCapacity.activeCPU / networkCapacity.totalCPU,
      valueLabel: <FormattedNumber value={networkCapacity.totalCPU / 1000} maximumFractionDigits={0} />
    },
    {
      key: "gpu",
      label: "GPU",
      percent: networkCapacity.activeGPU / networkCapacity.totalGPU,
      valueLabel: <FormattedNumber value={networkCapacity.totalGPU} />
    },
    {
      key: "memory",
      label: "Memory",
      percent: networkCapacity.activeMemory / networkCapacity.totalMemory,
      valueLabel: (
        <>
          <FormattedNumber value={totalMemory.value} maximumFractionDigits={1} /> {totalMemory.unit}
        </>
      )
    },
    {
      key: "storage",
      label: "Storage",
      percent: networkCapacity.activeStorage / networkCapacity.totalStorage,
      valueLabel: (
        <>
          <FormattedNumber value={totalStorage.value} maximumFractionDigits={1} /> {totalStorage.unit}
        </>
      )
    }
  ];
}
