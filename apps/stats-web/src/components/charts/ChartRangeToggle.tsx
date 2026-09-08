import type { FC } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@akashnetwork/ui/components";

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
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger className="h-8 w-[140px] text-xs" aria-label="Select a range">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {options.map(option => (
        <SelectItem key={option.key} value={option.key}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
