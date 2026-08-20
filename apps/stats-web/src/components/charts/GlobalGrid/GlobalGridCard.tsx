import { type FC } from "react";
import { FormattedNumber } from "react-intl";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@akashnetwork/ui/components";
import Link from "next/link";

import { NetworkGlobeCanvas } from "@/components/charts/GlobalGrid/NetworkGlobeCanvas";
import { fmtBytes, fmtCPU, fmtNum } from "@/lib/globeFormatters";
import type { GlobeMarker } from "@/lib/providerGeo";

export const DEPENDENCIES = { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button, NetworkGlobeCanvas };

export type GlobalGridStats = {
  activeProviderCount: number;
  totalCPU: number;
  totalGPU: number;
  totalMemory: number;
  totalStorage: number;
};

export type GlobalGridFooter = {
  countryCount: number;
  usCount: number;
  elsewhereCount: number;
  medianUptime30d: number | null;
};

export type GlobalGridCardProps = {
  stats: GlobalGridStats;
  /** null when provider geo data failed to load - the globe still falls back to placeholder markers, but these figures must not show as fake zeros. */
  footer: GlobalGridFooter | null;
  markers: GlobeMarker[];
  dependencies?: typeof DEPENDENCIES;
};

export const GlobalGridCard: FC<GlobalGridCardProps> = ({ stats, footer, markers, dependencies: d = DEPENDENCIES }) => {
  const statItems = [
    { label: "Active Providers", value: fmtNum(stats.activeProviderCount) },
    { label: "vCPUs", value: fmtCPU(stats.totalCPU) },
    { label: "GPUs", value: fmtNum(stats.totalGPU) },
    { label: "Memory", value: fmtBytes(stats.totalMemory) },
    { label: "Storage", value: fmtBytes(stats.totalStorage) }
  ];

  return (
    <d.Card>
      <d.CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="flex flex-col gap-1.5">
          <d.CardTitle className="text-base">Global Grid</d.CardTitle>
          <d.CardDescription>
            {footer ? (
              <>
                {footer.usCount + footer.elsewhereCount} online providers across {footer.countryCount} countries · drag to rotate
              </>
            ) : (
              "Provider locations · drag to rotate"
            )}
          </d.CardDescription>
        </div>
        <d.Button asChild size="sm" variant="outline">
          <Link href="https://akash.network/ecosystem/providers" target="_blank" rel="noreferrer">
            View all providers
          </Link>
        </d.Button>
      </d.CardHeader>

      <d.CardContent className="grid grid-cols-3 gap-y-4 border-t pt-4 sm:grid-cols-5">
        {statItems.map(item => (
          <div key={item.label}>
            <p className="text-xl font-semibold tabular-nums text-foreground sm:text-2xl">{item.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </d.CardContent>

      <d.CardContent>
        <d.NetworkGlobeCanvas markers={markers} />
      </d.CardContent>

      <d.CardFooter className="flex-col items-start gap-1 border-t pt-3.5">
        {footer ? (
          <>
            <p className="text-xs font-medium text-foreground">
              {footer.usCount} providers in the United States, {footer.elsewhereCount} elsewhere
            </p>
            <p className="text-[11px] text-muted-foreground">
              Markers plot online providers with resolved coordinates
              {footer.medianUptime30d !== null && (
                <>
                  {" · median 30-day uptime "}
                  <FormattedNumber value={footer.medianUptime30d} style="percent" minimumFractionDigits={2} maximumFractionDigits={2} />
                </>
              )}
            </p>
          </>
        ) : (
          <p className="text-[11px] text-muted-foreground">Provider location data is loading or unavailable - showing placeholder markers.</p>
        )}
      </d.CardFooter>
    </d.Card>
  );
};
