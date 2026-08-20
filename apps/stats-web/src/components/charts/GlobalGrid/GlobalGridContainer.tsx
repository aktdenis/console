"use client";
import type { FC } from "react";

import { GlobalGridCard, type GlobalGridFooter, type GlobalGridStats } from "@/components/charts/GlobalGrid/GlobalGridCard";
import { countUniqueCountries, countUSVsElsewhere, filterOnlineProvidersWithCoords, medianUptime30d, toMarkers } from "@/lib/providerGeo";
import { useProviders } from "@/queries";

export type GlobalGridContainerProps = {
  stats: GlobalGridStats;
};

export const GlobalGridContainer: FC<GlobalGridContainerProps> = ({ stats }) => {
  const { data: providers, status } = useProviders();

  const onlineWithCoords = providers ? filterOnlineProvidersWithCoords(providers) : [];
  const markers = toMarkers(onlineWithCoords);

  const footer: GlobalGridFooter | null =
    status === "success"
      ? {
          countryCount: countUniqueCountries(onlineWithCoords),
          ...countUSVsElsewhere(onlineWithCoords),
          medianUptime30d: medianUptime30d(onlineWithCoords)
        }
      : null;

  return <GlobalGridCard stats={stats} footer={footer} markers={markers} />;
};
