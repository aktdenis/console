"use client";
import type { FC } from "react";

import { MedianUptimeCard } from "@/components/charts/GlobalGrid/MedianUptimeCard";
import { filterOnlineProvidersWithCoords, medianUptime30d } from "@/lib/providerGeo";
import { useProviders } from "@/queries";

export type MedianUptimeCardContainerProps = {
  className?: string;
};

export const MedianUptimeCardContainer: FC<MedianUptimeCardContainerProps> = ({ className }) => {
  const { data: providers } = useProviders();
  const onlineProviders = providers ? filterOnlineProvidersWithCoords(providers) : [];

  return <MedianUptimeCard medianUptime={medianUptime30d(onlineProviders)} className={className} />;
};
