import type { FC, ReactNode } from "react";
import { CustomTooltip } from "@akashnetwork/ui/components";
import { HelpCircle } from "iconoir-react";

export type StatCardRowItem = {
  key: string;
  label: string;
  value: ReactNode;
  tooltip?: string;
};

export type StatCardRowProps = {
  items: StatCardRowItem[];
};

export const StatCardRow: FC<StatCardRowProps> = ({ items }) => (
  <div className="flex flex-col divide-y rounded-xl border sm:flex-row sm:divide-x sm:divide-y-0">
    {items.map(item => (
      <div key={item.key} className="flex flex-1 flex-col gap-2 p-6">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-card-foreground">{item.label}</span>
          {item.tooltip && (
            <CustomTooltip title={item.tooltip}>
              <HelpCircle className="size-4 text-muted-foreground" />
            </CustomTooltip>
          )}
        </div>
        <div className="flex items-center gap-2 text-2xl font-bold text-card-foreground">{item.value}</div>
      </div>
    ))}
  </div>
);
