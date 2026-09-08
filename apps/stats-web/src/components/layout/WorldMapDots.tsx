import type { FC } from "react";

import type { GlobeMarker } from "@/lib/providerGeo";

export type WorldMapDotsProps = {
  markers: GlobeMarker[];
  className?: string;
};

const VIEW_SIZE = 94;
const RADIUS = VIEW_SIZE / 2;

/** Matches the globe illustration's framing: Americas-centered, with a slight northern tilt. */
const CENTER_LON_DEG = -55;
const CENTER_LAT_DEG = 15;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Orthographic projection - only markers on the globe's visible (near) hemisphere are returned. */
function project([lat, lng]: GlobeMarker): { x: number; y: number } | null {
  const phi0 = toRadians(CENTER_LAT_DEG);
  const lambda0 = toRadians(CENTER_LON_DEG);
  const phi = toRadians(lat);
  const lambda = toRadians(lng);

  const cosC = Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda - lambda0);
  if (cosC < 0.05) return null;

  return {
    x: RADIUS + RADIUS * Math.cos(phi) * Math.sin(lambda - lambda0),
    y: RADIUS - RADIUS * (Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda - lambda0))
  };
}

export const WorldMapDots: FC<WorldMapDotsProps> = ({ markers, className }) => (
  <svg viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`} className={className} role="img" aria-label="Provider locations on a globe">
    <image href="/images/getting-started/world.svg" width={VIEW_SIZE} height={VIEW_SIZE} />
    <g className="fill-white">
      {markers.map((marker, index) => {
        const point = project(marker);
        return point && <circle key={index} cx={point.x} cy={point.y} r={1} />;
      })}
    </g>
  </svg>
);
