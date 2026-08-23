import type { FC, ReactNode } from "react";
import { FormattedNumber } from "react-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Progress } from "@akashnetwork/ui/components";

export const DEPENDENCIES = { Card, CardContent, CardDescription, CardHeader, CardTitle, Progress };

export type UtilizationRow = {
  key: string;
  label: string;
  percent: number;
  activeLabel: ReactNode;
  totalLabel: ReactNode;
};

export type UtilizationCardProps = {
  /** Omit when an outer heading right above this card already states it - avoids repeating the same title twice in a row. */
  title?: string;
  description: string;
  rows: UtilizationRow[];
  dependencies?: typeof DEPENDENCIES;
};

export const UtilizationCard: FC<UtilizationCardProps> = ({ title, description, rows, dependencies: d = DEPENDENCIES }) => (
  <d.Card>
    <d.CardHeader className="gap-1.5 space-y-0">
      {title ? (
        <>
          <d.CardTitle className="text-base">{title}</d.CardTitle>
          <d.CardDescription>{description}</d.CardDescription>
        </>
      ) : (
        <d.CardTitle className="text-base">{description}</d.CardTitle>
      )}
    </d.CardHeader>

    <d.CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {rows.map(row => (
        <div key={row.key} className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="flex-1 font-medium text-muted-foreground">{row.label}</span>
            <span className="font-semibold text-foreground">
              <FormattedNumber value={row.percent} style="percent" maximumFractionDigits={1} />
            </span>
          </div>
          <div className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-xl font-semibold tracking-tight text-foreground">{row.activeLabel}</span>
            <span className="text-xs text-muted-foreground">{row.totalLabel}</span>
          </div>
          <d.Progress value={row.percent * 100} className="h-1.5" />
        </div>
      ))}
    </d.CardContent>
  </d.Card>
);
