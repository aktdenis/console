import type { FC, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@akashnetwork/ui/components";

export type CapacityBubbleRow = {
  key: string;
  label: string;
  percent: number;
  valueLabel: ReactNode;
};

export type NetworkCapacityBubblesProps = {
  rows: CapacityBubbleRow[];
  className?: string;
};

/** Bubble diameter scales with utilization between these bounds, so even a near-empty resource still reads as a circle. */
const MIN_DIAMETER_PX = 112;
const MAX_DIAMETER_PX = 224;

type PlacedCircle = { x: number; y: number; r: number };

/**
 * Greedy front-chain packing: place the largest circle first, then place each
 * subsequent circle tangent to an already-placed one, at whichever angle lands it
 * closest to the cluster's center. Produces a tight, organic cluster (like a real
 * circle-packing chart) instead of an evenly gapped row.
 */
function packCircles(radii: number[]): { x: number; y: number }[] {
  const order = radii.map((_, i) => i).sort((a, b) => radii[b] - radii[a]);
  const placed: PlacedCircle[] = new Array(radii.length);

  order.forEach((i, orderIndex) => {
    const r = radii[i];

    if (orderIndex === 0) {
      placed[i] = { x: 0, y: 0, r };
      return;
    }

    const anchors = order.slice(0, orderIndex).map(j => placed[j]);

    if (orderIndex === 1) {
      const anchor = anchors[0];
      placed[i] = { x: anchor.x + anchor.r + r, y: anchor.y, r };
      return;
    }

    let best = { x: 0, y: 0 };
    let bestDist = Infinity;

    for (let angleDeg = 0; angleDeg < 360; angleDeg += 3) {
      const angle = (angleDeg * Math.PI) / 180;

      for (const anchor of anchors) {
        const dist = anchor.r + r;
        const x = anchor.x + Math.cos(angle) * dist;
        const y = anchor.y + Math.sin(angle) * dist;
        const overlaps = anchors.some(p => Math.hypot(x - p.x, y - p.y) < p.r + r - 0.5);

        if (!overlaps) {
          const distFromCenter = Math.hypot(x, y);
          if (distFromCenter < bestDist) {
            bestDist = distFromCenter;
            best = { x, y };
          }
        }
      }
    }

    placed[i] = { ...best, r };
  });

  return placed.map(({ x, y }) => ({ x, y }));
}

export const NetworkCapacityBubbles: FC<NetworkCapacityBubblesProps> = ({ rows, className }) => {
  const radii = rows.map(row => (MIN_DIAMETER_PX + row.percent * (MAX_DIAMETER_PX - MIN_DIAMETER_PX)) / 2);
  const positions = packCircles(radii);
  const minX = Math.min(...positions.map((p, i) => p.x - radii[i]));
  const maxX = Math.max(...positions.map((p, i) => p.x + radii[i]));
  const minY = Math.min(...positions.map((p, i) => p.y - radii[i]));
  const maxY = Math.max(...positions.map((p, i) => p.y + radii[i]));
  const stageWidth = maxX - minX;
  const stageHeight = maxY - minY;

  return (
    <Card className={className}>
      <CardHeader className="gap-1.5 space-y-0">
        <CardTitle className="text-base">Network capacity</CardTitle>
      </CardHeader>

      <CardContent className="flex min-h-[420px] items-center justify-center py-8">
        {/* Sized in stage units with an enforced aspect-ratio, then positioned by percentage so the whole cluster scales down together on narrow viewports instead of overflowing. */}
        <div className="relative w-full" style={{ maxWidth: stageWidth, aspectRatio: stageWidth / stageHeight }}>
          {rows.map((row, index) => {
            const r = radii[index];
            const { x, y } = positions[index];

            return (
              <div
                key={row.key}
                className="absolute"
                style={{
                  width: `${((r * 2) / stageWidth) * 100}%`,
                  height: `${((r * 2) / stageHeight) * 100}%`,
                  left: `${((x - minX - r) / stageWidth) * 100}%`,
                  top: `${((y - minY - r) / stageHeight) * 100}%`
                }}
              >
                <div className="animate-capacity-bubble-float h-full w-full" style={{ animationDelay: `${index * 0.7}s` }}>
                  <div className="relative h-full w-full rounded-full transition-transform duration-300 ease-out hover:z-10 hover:scale-110">
                    <div
                      className="flex h-full w-full items-center justify-center rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle at 35% 30%, hsl(var(--capacity-bubble) / 0.95), hsl(var(--capacity-bubble) / 0.85) 65%, hsl(var(--capacity-bubble) / 0.75) 100%)"
                      }}
                    >
                      <div className="flex flex-col items-center gap-0.5 px-2 text-center">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-background/70">{row.label}</span>
                        <span className="text-lg font-bold tabular-nums tracking-tight text-background">{row.valueLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
