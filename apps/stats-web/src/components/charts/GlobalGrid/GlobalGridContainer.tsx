"use client";
import type { FC } from "react";

import { GlobalGridCard } from "@/components/charts/GlobalGrid/GlobalGridCard";
import type { TopProviderRow } from "@/components/charts/GlobalGrid/TopProvidersCard";
import { countUniqueCountries, filterOnlineProvidersWithCoords, selectFeaturedProviders, selectTopProvidersByActiveCpu, toMarkers } from "@/lib/providerGeo";
import { useProviders } from "@/queries";

const FEATURED_PROVIDER_COUNT = 10;
const TOP_PROVIDER_COUNT = 10;

export const GlobalGridContainer: FC = () => {
  const { data: providers, status } = useProviders();

  const onlineWithCoords = providers ? filterOnlineProvidersWithCoords(providers) : [];
  const markers = toMarkers(onlineWithCoords);
  const featuredProviders = providers ? selectFeaturedProviders(providers, FEATURED_PROVIDER_COUNT) : [];
  const topProviders: TopProviderRow[] = providers
    ? selectTopProvidersByActiveCpu(providers, TOP_PROVIDER_COUNT).map(p => ({ key: p.owner, name: p.name, region: p.region, activeCores: p.activeCPU / 1000 }))
    : [];
  const providerCountLabel =
    status === "success"
      ? `${onlineWithCoords.length} online providers across ${countUniqueCountries(onlineWithCoords)} countries · drag to rotate`
      : "Provider locations · drag to rotate";

  return <GlobalGridCard markers={markers} providerCountLabel={providerCountLabel} featuredProviders={featuredProviders} topProviders={topProviders} />;
};
