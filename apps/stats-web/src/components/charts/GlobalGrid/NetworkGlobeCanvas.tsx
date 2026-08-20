"use client";
import { type FC, useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

import type { GlobeMarker } from "@/lib/providerGeo";
import { resolveGlobeMarkers } from "@/lib/providerGeo";

const CANVAS_PX = 520;
const THETA = 0.2;

/**
 * Ported from akash-network/website src/components/home/NetworkGlobe.tsx. Config
 * (canvas size, phi/theta/diffuse/mapSamples, light/dark colours, marker colour/size,
 * rotation speed, drag sensitivity) is preserved exactly - it is fidelity, not decoration.
 */
export const FALLBACK_MARKERS: GlobeMarker[] = [
  [37.4316, -78.6569],
  [50.1109, 8.6821],
  [35.6762, 139.6503],
  [1.3521, 103.8198],
  [-23.5505, -46.6333]
];

export type NetworkGlobeCanvasProps = {
  markers: GlobeMarker[];
};

export const NetworkGlobeCanvas: FC<NetworkGlobeCanvasProps> = ({ markers }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(-0.6);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const rafRef = useRef<number>(0);

  const [grabbing, setGrabbing] = useState(false);

  const resolvedMarkers = resolveGlobeMarkers(markers, FALLBACK_MARKERS);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getIsDark = () => document.documentElement.classList.contains("dark");

    const themeConfig = (dark: boolean) => ({
      dark: dark ? 1 : 0,
      mapBrightness: dark ? 2.5 : 6,
      baseColor: (dark ? [0.3, 0.3, 0.3] : [0.85, 0.85, 0.85]) as [number, number, number],
      glowColor: (dark ? [0.07, 0.07, 0.07] : [1, 1, 1]) as [number, number, number]
    });

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: CANVAS_PX,
      height: CANVAS_PX,
      phi: phiRef.current,
      theta: THETA,
      diffuse: 1.2,
      mapSamples: 32000,
      markerColor: [1.0, 0.255, 0.298],
      ...themeConfig(getIsDark()),
      markers: resolvedMarkers.map(location => ({ location, size: 0.03 }))
    });

    const themeObserver = new MutationObserver(() => {
      globe.update(themeConfig(getIsDark()));
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    function animate() {
      if (!dragging.current) phiRef.current += 0.003;
      globe.update({ phi: phiRef.current, theta: THETA });
      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      globe.destroy();
      themeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedMarkers]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    lastX.current = e.clientX;
    setGrabbing(true);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const displayed = (e.currentTarget as HTMLDivElement).offsetWidth || CANVAS_PX;
    const sensitivity = 0.005 * (CANVAS_PX / displayed);
    phiRef.current += (e.clientX - lastX.current) * sensitivity;
    lastX.current = e.clientX;
  };
  const onPointerUp = () => {
    dragging.current = false;
    setGrabbing(false);
  };

  return (
    <div className="flex items-center justify-center overflow-hidden rounded-xl border bg-muted/40 py-8">
      <div
        aria-hidden="true"
        className="relative select-none"
        style={{
          width: CANVAS_PX,
          maxWidth: "100%",
          aspectRatio: "1 / 1",
          cursor: grabbing ? "grabbing" : "grab",
          touchAction: "none"
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "auto" }} />
      </div>
    </div>
  );
};
