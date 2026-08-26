"use client";
import type { FC } from "react";
import { FormattedNumber } from "react-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Progress } from "@akashnetwork/ui/components";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { NetworkGlobeCanvas } from "@/components/charts/GlobalGrid/NetworkGlobeCanvas";
import type { UtilizationRow } from "@/components/charts/UtilizationCard";
import type { FeaturedProvider, GlobeMarker } from "@/lib/providerGeo";

export const DEPENDENCIES = { Card, CardContent, CardDescription, CardHeader, CardTitle, NetworkGlobeCanvas, Progress };

export type GlobalGridCardProps = {
  utilizationRows: UtilizationRow[];
  markers: GlobeMarker[];
  providerCountLabel: string;
  featuredProviders: FeaturedProvider[];
  dependencies?: typeof DEPENDENCIES;
};

export const GlobalGridCard: FC<GlobalGridCardProps> = ({
  utilizationRows,
  markers,
  providerCountLabel,
  featuredProviders,
  dependencies: d = DEPENDENCIES
}) => {
  return (
    <div className="flex flex-col gap-4">
      <d.Card>
        <d.CardHeader className="gap-1.5 space-y-0">
          <d.CardTitle className="text-base">Leased versus total capacity</d.CardTitle>
        </d.CardHeader>

        <d.CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {utilizationRows.map(row => (
            <div key={row.key} className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">{row.label}</span>
              <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                <span className="text-2xl font-semibold tracking-tight text-foreground">{row.activeLabel}</span>
                <span className="text-sm text-muted-foreground">{row.totalLabel}</span>
              </div>
              <d.Progress value={row.percent * 100} className="h-1.5" />
              <span className="text-sm font-semibold text-foreground">
                <FormattedNumber value={row.percent} style="percent" maximumFractionDigits={1} />
              </span>
            </div>
          ))}
        </d.CardContent>
      </d.Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
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
    </div>
  );
};
