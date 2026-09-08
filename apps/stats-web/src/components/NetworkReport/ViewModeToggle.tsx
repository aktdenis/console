"use client";
import type { FC } from "react";
import { ToggleGroup, ToggleGroupItem, Tooltip, TooltipContent, TooltipTrigger } from "@akashnetwork/ui/components";
import { BarChart3, Table } from "lucide-react";

import { cn } from "@/lib/utils";

export type StatsViewMode = "chart" | "table";

export type ViewModeToggleProps = {
  value: StatsViewMode;
  onValueChange: (value: StatsViewMode) => void;
};

const OPTIONS: { key: StatsViewMode; label: string; icon: typeof BarChart3 }[] = [
  { key: "chart", label: "Chart view", icon: BarChart3 },
  { key: "table", label: "Table view", icon: Table }
];

export const ViewModeToggle: FC<ViewModeToggleProps> = ({ value, onValueChange }) => (
  <ToggleGroup type="single" value={value} aria-label="Switch between chart and table view" className="gap-0.5 rounded-md border p-0.5">
    {OPTIONS.map(option => (
      <Tooltip key={option.key}>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value={option.key}
            aria-label={option.label}
            onClick={() => onValueChange(option.key)}
            className={cn("h-8 w-8 rounded-sm p-0", value === option.key && "bg-accent text-accent-foreground")}
          >
            <option.icon className="size-4" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>{option.label}</TooltipContent>
      </Tooltip>
    ))}
  </ToggleGroup>
);
