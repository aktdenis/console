import type { FC, ReactNode } from "react";
import { FormattedNumber } from "react-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@akashnetwork/ui/components";

import { DotMatrixBar } from "@/components/charts/DotMatrixBar";

export const DEPENDENCIES = { Card, CardContent, CardHeader, CardTitle };

export type UtilizationRow = {
  key: string;
  label: string;
  percent: number;
  activeLabel: ReactNode;
  totalLabel: ReactNode;
};

export type UtilizationCardProps = {
  title: string;
  rows: UtilizationRow[];
  className?: string;
  dependencies?: typeof DEPENDENCIES;
};

export const UtilizationCard: FC<UtilizationCardProps> = ({ title, rows, className, dependencies: d = DEPENDENCIES }) => (
  <d.Card className={className}>
    <d.CardHeader className="gap-1.5 space-y-0">
      <d.CardTitle className="text-base">{title}</d.CardTitle>
    </d.CardHeader>

    <d.CardContent className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
      {rows.map(row => (
        <div key={row.key} className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">{row.label}</span>
          <div className="flex min-h-14 flex-wrap items-baseline gap-x-1.5 gap-y-0">
            <span className="text-3xl font-semibold tracking-tight text-foreground">{row.activeLabel}</span>
            <span className="whitespace-nowrap text-sm text-muted-foreground">{row.totalLabel}</span>
          </div>
          <DotMatrixBar percent={row.percent} />
          <span className="text-base font-semibold text-foreground">
            <FormattedNumber value={row.percent} style="percent" maximumFractionDigits={1} />
          </span>
        </div>
      ))}
    </d.CardContent>
  </d.Card>
);
