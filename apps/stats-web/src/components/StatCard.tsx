import type { FC, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@akashnetwork/ui/components";
import { cn } from "@akashnetwork/ui/utils";
import { InfoCircle } from "iconoir-react";

export type StatCardProps = {
  label: string;
  tooltip?: string;
  content: ReactNode;
  className?: string;
  contentClassName?: string;
};

export const StatCard: FC<StatCardProps> = ({ label, tooltip, content, className, contentClassName }) => (
  <div className={cn("flex flex-col gap-2 rounded-md border border-border bg-card p-6 shadow-sm", className)}>
    <span className="flex items-center gap-1.5 text-sm font-medium text-card-foreground">
      {label}
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoCircle className="size-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-balance">{tooltip}</TooltipContent>
        </Tooltip>
      )}
    </span>
    <span className={cn("flex items-center gap-2 text-2xl font-bold text-card-foreground", contentClassName)}>{content}</span>
  </div>
);
