import type { FC } from "react";
import { ToggleGroup, ToggleGroupItem } from "@akashnetwork/ui/components";

export type ChartRangeOption = {
  key: string;
  days: number;
  label: string;
};

export type ChartRangeToggleProps = {
  options: readonly ChartRangeOption[];
  value: string;
  onValueChange: (value: string) => void;
};

export const ChartRangeToggle: FC<ChartRangeToggleProps> = ({ options, value, onValueChange }) => (
  <ToggleGroup
    type="single"
    variant="outline"
    size="sm"
    value={value}
    onValueChange={next => {
      if (next) onValueChange(next);
    }}
    className="flex-wrap justify-start gap-0"
  >
    {options.map(option => (
      <ToggleGroupItem
        key={option.key}
        value={option.key}
        aria-label={option.label}
        className="rounded-none first:rounded-l-md last:rounded-r-md [&:not(:first-child)]:-ml-px"
      >
        {option.label}
      </ToggleGroupItem>
    ))}
  </ToggleGroup>
);
