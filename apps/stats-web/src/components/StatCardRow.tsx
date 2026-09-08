import type { FC } from "react";
import { cn } from "@akashnetwork/ui/utils";

import { StatCard, type StatCardProps } from "@/components/StatCard";

export type StatCardRowItem = { key: string } & Omit<StatCardProps, "className">;

export type StatCardRowProps = {
  items: StatCardRowItem[];
  className?: string;
};

export const StatCardRow: FC<StatCardRowProps> = ({ items, className }) => (
  <div className={cn("grid gap-2 sm:grid-cols-2", className)}>
    {items.map(({ key, ...item }) => (
      <StatCard key={key} {...item} />
    ))}
  </div>
);
