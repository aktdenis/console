"use client";
import React from "react";
import { FormattedNumber } from "react-intl";

import { cn } from "@/lib/utils";

export interface DiffPercentageChipProps {
  value: number;
  className?: string;
  size?: "small" | "medium";
}

export const DiffPercentageChip: React.FunctionComponent<DiffPercentageChipProps> = ({ value, size = "small", className = "" }) => {
  if (typeof value !== "number") return null;

  const isNeutral = Math.abs(value) < 0.00005;
  const isPositiveDiff = value > 0;

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-md font-medium",
        isNeutral ? "bg-muted text-muted-foreground" : isPositiveDiff ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive",
        size === "small" ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-sm",
        className
      )}
    >
      <FormattedNumber style="percent" minimumFractionDigits={2} maximumFractionDigits={2} signDisplay="exceptZero" value={value} />
    </span>
  );
};
