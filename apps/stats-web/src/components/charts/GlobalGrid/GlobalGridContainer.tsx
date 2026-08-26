"use client";
import type { FC } from "react";
import { FormattedNumber } from "react-intl";

import { GlobalGridCard } from "@/components/charts/GlobalGrid/GlobalGridCard";
import type { UtilizationRow } from "@/components/charts/UtilizationCard";
import { countUniqueCountries, filterOnlineProvidersWithCoords, selectFeaturedProviders, toMarkers } from "@/lib/providerGeo";
import { bytesToShrink } from "@/lib/unitUtils";
import { useProviders } from "@/queries";
import type { NetworkCapacity } from "@/types";

const FEATURED_PROVIDER_COUNT = 10;

export type GlobalGridContainerProps = {
  networkCapacity: NetworkCapacity;
};

export const GlobalGridContainer: FC<GlobalGridContainerProps> = ({ networkCapacity }) => {
  const { data: providers, status } = useProviders();

  const onlineWithCoords = providers ? filterOnlineProvidersWithCoords(providers) : [];
  const markers = toMarkers(onlineWithCoords);
  const featuredProviders = providers ? selectFeaturedProviders(providers, FEATURED_PROVIDER_COUNT) : [];
  const providerCountLabel =
    status === "success"
      ? `${onlineWithCoords.length} online providers across ${countUniqueCountries(onlineWithCoords)} countries · drag to rotate`
      : "Provider locations · drag to rotate";

  const memory = bytesToShrink(networkCapacity.activeMemory, true);
  const totalMemory = bytesToShrink(networkCapacity.totalMemory, true);
  const storage = bytesToShrink(networkCapacity.activeStorage, true);
  const totalStorage = bytesToShrink(networkCapacity.totalStorage, true);

  const utilizationRows: UtilizationRow[] = [
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

  return <GlobalGridCard utilizationRows={utilizationRows} markers={markers} providerCountLabel={providerCountLabel} featuredProviders={featuredProviders} />;
};
