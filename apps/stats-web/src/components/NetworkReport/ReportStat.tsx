import type { FC, ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@akashnetwork/ui/components";
import { InfoCircle } from "iconoir-react";

export type ReportStatProps = {
  label: string;
  tooltip?: string;
  content: ReactNode;
};

export const ReportStat: FC<ReportStatProps> = ({ label, tooltip, content }) => (
  <div className="flex flex-col gap-1">
    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      {label}
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoCircle className="size-3.5" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-balance">{tooltip}</TooltipContent>
        </Tooltip>
      )}
    </span>
    <span className="flex items-center gap-2 text-xl font-semibold text-foreground">{content}</span>
  </div>
);
