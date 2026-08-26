import React from "react";
import { FormattedNumber } from "react-intl";
import { Card, CardContent } from "@akashnetwork/ui/components";

interface ICarouselStatCardProps {
  number: React.ReactNode;
  text: string;
  diffPercent?: number;
  /** Recent values, oldest first - rendered as a bar sparkline. Omitted bars render as gaps, not zero. */
  trend?: number[];
  periodLabel: string;
}

export const CarouselStatCard: React.FunctionComponent<ICarouselStatCardProps> = ({ number, text, diffPercent, trend, periodLabel }) => {
  const maxTrendValue = trend && trend.length > 0 ? Math.max(...trend, 0) : 0;

  return (
    <Card className="aspect-[4/3] rounded-xl">
      <CardContent className="flex h-full flex-col justify-between p-6">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{text}</span>

        <div className="text-xl font-bold tabular-nums leading-none tracking-tight text-foreground sm:text-2xl lg:text-3xl">{number}</div>

        {trend && trend.length > 0 && (
          <div className="flex h-10 items-end gap-1">
            {trend.map((value, i) => (
              <div
                key={i}
                className="min-h-[3px] flex-1 rounded-sm bg-muted"
                style={{ height: maxTrendValue > 0 ? `${Math.max((value / maxTrendValue) * 100, 6)}%` : "6%" }}
              />
            ))}
          </div>
        )}

        {!!diffPercent && (
          <div className="text-sm">
            <span className={diffPercent > 0 ? "font-semibold text-success" : "font-semibold text-destructive"}>
              <FormattedNumber style="percent" minimumFractionDigits={1} maximumFractionDigits={1} signDisplay="exceptZero" value={diffPercent} />
            </span>
            <span className="text-muted-foreground"> {periodLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
