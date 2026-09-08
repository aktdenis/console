import type { FC } from "react";
import { FormattedNumber } from "react-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@akashnetwork/ui/components";

import { cn } from "@/lib/utils";

export type MedianUptimeCardProps = {
  medianUptime: number | null;
  className?: string;
};

export const MedianUptimeCard: FC<MedianUptimeCardProps> = ({ medianUptime, className }) => (
  <Card className={cn("flex aspect-square flex-col", className)}>
    <CardHeader className="gap-1.5 space-y-0">
      <CardTitle className="text-base">Provider reliability</CardTitle>
    </CardHeader>

    <CardContent className="flex flex-1 flex-col justify-end">
      <div className="text-6xl font-bold tabular-nums tracking-tight text-foreground">
        {medianUptime === null ? "—" : <FormattedNumber value={medianUptime} style="percent" minimumFractionDigits={2} maximumFractionDigits={2} />}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Median 30-day uptime across online providers</p>
    </CardContent>
  </Card>
);
