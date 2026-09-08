import { type FC, Fragment } from "react";
import { FormattedNumber } from "react-intl";
import { Card, CardContent, CardHeader, CardTitle, Progress } from "@akashnetwork/ui/components";
import { cn } from "@akashnetwork/ui/utils";

export const DEPENDENCIES = { Card, CardContent, CardHeader, CardTitle, Progress };

export type TopProviderRow = {
  key: string;
  name: string;
  region: string;
  activeCores: number;
};

export type TopProvidersCardProps = {
  rows: TopProviderRow[];
  dependencies?: typeof DEPENDENCIES;
};

export const TopProvidersCard: FC<TopProvidersCardProps> = ({ rows, dependencies: d = DEPENDENCIES }) => {
  const maxCores = Math.max(...rows.map(row => row.activeCores), 0);

  return (
    <d.Card>
      <d.CardHeader className="gap-1.5 space-y-0">
        <d.CardTitle className="text-base">Top Providers by Active CPU</d.CardTitle>
      </d.CardHeader>

      <d.CardContent className="overflow-x-auto">
        <div className="grid min-w-[480px] grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,2fr)_auto] gap-x-4">
          {rows.map((row, index) => {
            const percent = maxCores > 0 ? row.activeCores / maxCores : 0;
            const cellClassName = cn("flex items-center py-3 text-sm", index !== rows.length - 1 && "border-b");

            return (
              <Fragment key={row.key}>
                <span className={cn(cellClassName, "text-xs font-semibold tabular-nums text-muted-foreground")}>{index + 1}</span>
                <span className={cn(cellClassName, "truncate font-medium text-foreground")}>{row.name}</span>
                <span className={cn(cellClassName, "truncate text-xs text-muted-foreground")}>{row.region}</span>
                <div className={cellClassName}>
                  <d.Progress value={percent * 100} className="h-1.5 w-full" />
                </div>
                <span className={cn(cellClassName, "justify-end whitespace-nowrap text-right font-semibold tabular-nums text-foreground")}>
                  <FormattedNumber value={row.activeCores} maximumFractionDigits={1} /> <span className="font-normal text-muted-foreground">cores</span>
                </span>
              </Fragment>
            );
          })}
        </div>
      </d.CardContent>
    </d.Card>
  );
};
