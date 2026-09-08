"use client";
import type { FC } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@akashnetwork/ui/components";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { NetworkGlobeCanvas } from "@/components/charts/GlobalGrid/NetworkGlobeCanvas";
import { type TopProviderRow, TopProvidersCard } from "@/components/charts/GlobalGrid/TopProvidersCard";
import type { FeaturedProvider, GlobeMarker } from "@/lib/providerGeo";

export const DEPENDENCIES = { Card, CardContent, CardDescription, CardHeader, CardTitle, NetworkGlobeCanvas, TopProvidersCard };

export type GlobalGridCardProps = {
  markers: GlobeMarker[];
  providerCountLabel: string;
  featuredProviders: FeaturedProvider[];
  topProviders: TopProviderRow[];
  dependencies?: typeof DEPENDENCIES;
};

export const GlobalGridCard: FC<GlobalGridCardProps> = ({ markers, providerCountLabel, featuredProviders, topProviders, dependencies: d = DEPENDENCIES }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-4">
        <d.Card className="lg:col-span-3">
          <d.CardHeader className="gap-1.5 space-y-0">
            <d.CardTitle className="text-base">Global Grid</d.CardTitle>
            <d.CardDescription>{providerCountLabel}</d.CardDescription>
          </d.CardHeader>
          <d.CardContent>
            <d.NetworkGlobeCanvas markers={markers} />
          </d.CardContent>
        </d.Card>

        <d.Card className="flex flex-col overflow-hidden lg:col-span-1">
          <div className="border-b px-4 py-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Featured Providers</span>
          </div>

          {featuredProviders.length > 0 ? (
            <div className="flex flex-1 flex-col divide-y">
              {featuredProviders.map(provider => (
                <div key={provider.owner} className="min-w-0 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-foreground">{provider.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{provider.region}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="flex-1 px-4 py-6 text-xs text-muted-foreground">Provider data is loading or unavailable.</p>
          )}

          <Link
            href="https://akash.network/ecosystem/providers"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-2 border-t px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/50 hover:no-underline"
          >
            See full provider directory
            <ArrowRight className="size-4" />
          </Link>
        </d.Card>
      </div>

      {topProviders.length > 0 && <d.TopProvidersCard rows={topProviders} />}
    </div>
  );
};
