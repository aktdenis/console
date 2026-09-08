import type { FC } from "react";

import { cn } from "@/lib/utils";

export type DotMatrixBarProps = {
  percent: number;
  className?: string;
};

/** Must match the literal `grid-cols-[repeat(14,...)]` below - Tailwind can't resolve an interpolated column count. */
const COLUMNS = 14;
const ROWS = 22;
const TOTAL_DOTS = COLUMNS * ROWS;

/** Staggered per-dot delay, bottom row first, so the bar reads as filling upward on mount. */
const STAGGER_MS = 3;

export const DotMatrixBar: FC<DotMatrixBarProps> = ({ percent, className }) => {
  const filledCount = Math.round(Math.min(Math.max(percent, 0), 1) * TOTAL_DOTS);

  return (
    <div className={cn("flex flex-col-reverse gap-1", className)}>
      {Array.from({ length: ROWS }, (_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1">
          {Array.from({ length: COLUMNS }, (_, colIndex) => {
            const dotIndex = rowIndex * COLUMNS + colIndex;
            const isFilled = dotIndex < filledCount;

            return (
              <span
                key={colIndex}
                className={cn("aspect-square rounded-full", isFilled ? "animate-dot-drop-in bg-foreground" : "bg-muted")}
                style={isFilled ? { animationDelay: `${dotIndex * STAGGER_MS}ms` } : undefined}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
