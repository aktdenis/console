import type { FC } from "react";
import { FormattedNumber } from "react-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@akashnetwork/ui/components";

import type { CapacityBubbleRow } from "@/components/charts/GlobalGrid/NetworkCapacityBubbles";
import { cn } from "@/lib/utils";

export type CapacityLegendCardProps = {
  rows: CapacityBubbleRow[];
  className?: string;
};

export const CapacityLegendCard: FC<CapacityLegendCardProps> = ({ rows, className }) => {
  const avgPercent = rows.reduce((sum, row) => sum + row.percent, 0) / rows.length;

  return (
    <Card className={cn("flex aspect-square flex-col", className)}>
      <CardHeader className="gap-1.5 space-y-0">
        <CardTitle className="text-base">Capacity at a glance</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-end">
        <div className="text-6xl font-bold tabular-nums tracking-tight text-foreground">
          <FormattedNumber value={avgPercent} style="percent" maximumFractionDigits={0} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Average utilization across vCPU, GPU, memory, and storage</p>
      </CardContent>
    </Card>
  );
};
