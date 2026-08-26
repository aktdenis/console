import { type FC, Fragment } from "react";
import { FormattedNumber } from "react-intl";
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Progress } from "@akashnetwork/ui/components";
import { cn } from "@akashnetwork/ui/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const DEPENDENCIES = { Card, CardContent, CardFooter, CardHeader, CardTitle, Progress, Button };

export type GpuPriceRow = {
  key: string;
  label: string;
  percent: number;
  used: number;
  total: number;
  pricePerHour: number | null;
};

export type GpuPriceListProps = {
  rows: GpuPriceRow[];
  dependencies?: typeof DEPENDENCIES;
};

export const GpuPriceList: FC<GpuPriceListProps> = ({ rows, dependencies: d = DEPENDENCIES }) => (
  <d.Card>
    <d.CardHeader className="gap-1.5 space-y-0">
      <d.CardTitle className="text-base">GPU capacity &amp; utilization</d.CardTitle>
    </d.CardHeader>

    <d.CardContent className="overflow-x-auto">
      <div className="grid min-w-[420px] grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)_auto_auto_auto] gap-x-4">
        {rows.map((row, index) => {
          const cellClassName = cn("flex items-center py-3 text-sm", index !== rows.length - 1 && "border-b");
          return (
            <Fragment key={row.key}>
              <span className={cn(cellClassName, "truncate font-medium text-foreground")}>{row.label}</span>
              <div className={cellClassName}>
                <d.Progress value={row.percent * 100} className="h-1.5 w-full" />
              </div>
              <span className={cn(cellClassName, "text-xs tabular-nums text-muted-foreground")}>
                <FormattedNumber value={row.percent} style="percent" maximumFractionDigits={0} />
              </span>
              <span className={cn(cellClassName, "whitespace-nowrap text-xs tabular-nums text-muted-foreground")}>
                <FormattedNumber value={row.used} /> / <FormattedNumber value={row.total} />
              </span>
              <span className={cn(cellClassName, "justify-end whitespace-nowrap text-right font-semibold tabular-nums text-foreground")}>
                {row.pricePerHour !== null ? (
                  <>
                    <FormattedNumber value={row.pricePerHour} style="currency" currency="USD" minimumFractionDigits={2} maximumFractionDigits={2} />
                    <span className="font-normal text-muted-foreground">/hr</span>
                  </>
                ) : (
                  <span className="font-normal text-muted-foreground">—</span>
                )}
              </span>
            </Fragment>
          );
        })}
      </div>
    </d.CardContent>

    <d.CardFooter className="border-t pt-4">
      <d.Button asChild variant="outline" size="sm" className="w-full hover:no-underline">
        <Link href="https://akash.network/pricing/gpus" target="_blank" rel="noreferrer">
          View full GPU pricing
          <ArrowRight className="ml-2 size-4" />
        </Link>
      </d.Button>
    </d.CardFooter>
  </d.Card>
);
