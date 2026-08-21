import type { FC, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@akashnetwork/ui/components";
import { cn } from "@akashnetwork/ui/utils";
import { InfoCircle } from "iconoir-react";

export type StatCardRowItem = {
  key: string;
  label: string;
  tooltip?: string;
  content: ReactNode;
};

export type StatCardRowProps = {
  items: StatCardRowItem[];
  className?: string;
};

export const StatCardRow: FC<StatCardRowProps> = ({ items, className }) => (
  <div className={cn("flex w-full items-stretch", className)}>
    {items.map(item => (
      <div
        key={item.key}
        className="flex flex-1 flex-col gap-2 border border-border bg-card p-6 first:rounded-tl-md last:rounded-tr-md [&:not(:first-child)]:-ml-px"
      >
        <span className="flex items-center gap-1.5 text-sm font-medium text-card-foreground">
          {item.label}
          {item.tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoCircle className="size-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-balance">{item.tooltip}</TooltipContent>
            </Tooltip>
          )}
        </span>
        <span className="flex items-center gap-2 text-2xl font-bold text-card-foreground">{item.content}</span>
      </div>
    ))}
  </div>
);
