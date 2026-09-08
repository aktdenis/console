import type { FC } from "react";
import { FormattedNumber } from "react-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@akashnetwork/ui/components";

import { cn } from "@/lib/utils";

export type PowerCapacityTileProps = {
  title: string;
  valueMW: number | null;
  caption: string;
  className?: string;
};

export const PowerCapacityTile: FC<PowerCapacityTileProps> = ({ title, valueMW, caption, className }) => (
  <Card className={cn("flex flex-col", className)}>
    <CardHeader className="gap-1.5 space-y-0">
      <CardTitle className="text-base">{title}</CardTitle>
    </CardHeader>

    <CardContent className="flex flex-1 flex-col justify-end">
      <div className="flex items-baseline gap-1.5 text-4xl font-bold tabular-nums tracking-tight text-foreground">
        {valueMW === null ? "—" : <FormattedNumber value={valueMW} maximumFractionDigits={2} />}
        <span className="text-lg font-semibold text-muted-foreground">MW</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
    </CardContent>
  </Card>
);
