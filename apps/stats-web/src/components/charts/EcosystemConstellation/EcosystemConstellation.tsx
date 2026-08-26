"use client";
import { type FC, type RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormattedNumber } from "react-intl";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@akashnetwork/ui/components";
import { ArrowRight } from "lucide-react";

import { formatGpuModelName } from "@/components/charts/GpuPriceList/gpuModelLabels";
import type { ConstellationNode } from "@/lib/ecosystemConstellation";
import { bytesToShrink } from "@/lib/unitUtils";
import { useProviderDashboard } from "@/queries";

const ACTIVE_RADIUS_PX = 55;
/**
 * How long a different node must be the closest one before it steals sticky away from an existing hub. The provider field
 * keeps animating underneath the cursor, so a short window isn't enough - a node can drift near a merely-stationary cursor
 * for a couple hundred ms without the user intending to target it. Kept well under a second so deliberately reaching a new
 * node still feels immediate.
 */
const STICKY_REASSIGN_DWELL_MS = 500;
/** The satellite lines only really track the cursor within this distance of the hub - "gently around the node" - beyond it, the target resets to the hub itself and CONVERGENCE_EASE_FACTOR eases the lines back rather than letting them keep stretching indefinitely far. */
const LINE_FOLLOW_RADIUS_PX = 45;
/** Fraction of the remaining distance the convergence point closes toward its target each frame - a low value reads as a gentle glide rather than an instant snap. */
const CONVERGENCE_EASE_FACTOR = 0.12;
/** How long the cursor can sit off the sticky hub (past its hit radius, not yet committed to a different node) before that hub is let go entirely - covers wandering into empty space, not just leaving the canvas or reaching a new node. */
const DISENGAGE_TIMEOUT_MS = 1100;
/** Caps how many providers animate at once - the field stays representative (a stable seeded sample, not just the first N) without getting visually crowded when the network has many online providers. */
const MAX_VISIBLE_PROVIDER_NODES = 32;
/** The visible sample is weighted toward providers with active deployments, so hovering around the field turns up satellites more often than not. */
const VISIBLE_WITH_DEPLOYMENTS_SHARE = 0.7;
const MAX_SATELLITES = 24;
const SATELLITE_MIN_RADIUS_PX = 70;
const SATELLITE_MAX_RADIUS_PX = 220;
const SATELLITE_SIZE_MIN_PX = 8;
const SATELLITE_SIZE_MAX_PX = 20;
/** Per-satellite entrance delay is biased toward small values (via an eased random curve) so most appear almost immediately, with only a trailing few streaming in "one by one" after - not a uniform spread across the whole window. */
const SATELLITE_ENTRANCE_STAGGER_MS = 40;
const SATELLITE_ENTRANCE_BIAS_EXPONENT = 2.5;
const SATELLITE_FADE_IN_MS = 280;
/** Ghost satellites (abandoned when a different node takes over sticky) don't all fade at once - each waits its own random delay up to this, then fades out over GHOST_FADE_MS, so the cluster dissolves one by one rather than blinking out together. */
const GHOST_STAGGER_MAX_MS = 550;
const GHOST_FADE_MS = 900;
const CURSOR_DOT_SIZE_PX = 8;
const NODE_MIN_SIZE_PX = 2.5;
const NODE_MAX_SIZE_PX = 7;
const NODE_ACTIVE_SIZE_PX = 9;
const NODE_COLOR = "rgba(255, 255, 255, 0.55)";
const NODE_ACTIVE_COLOR = "#ffffff";
/** Depth range a node travels through, far (just spawned) to near (about to recycle). Radius from the vanishing point scales with 1/z, so motion accelerates outward exactly like real perspective. */
const Z_FAR = 1;
const Z_NEAR = 0.05;
/** How far off dead-center a node's straight-line path passes, sampled once per life. Small values hang near the middle for a long time before rushing past; large values swing wide and exit early. Kept well off zero so the field doesn't bunch up at dead-center. */
const IMPACT_MIN = 0.25;
const IMPACT_MAX = 0.9;
/** Time to cross the full Z_FAR -> Z_NEAR range, randomized per node. Most nodes exit through the container edge well before reaching Z_NEAR, so actual on-screen lifetime is usually shorter. */
const DURATION_MS_MIN = 22000;
const DURATION_MS_MAX = 38000;

type NodeAnimState = {
  angle: number;
  impactParameter: number;
  z: number;
  speedPerMs: number;
  generation: number;
};

type SatelliteShape = { x: number; y: number; width: number; height: number };
type FadingCluster = { id: string; satellites: SatelliteShape[] };

/** A stable, non-cryptographic hash so each provider's trajectory is deterministic per life-cycle instead of reshuffling every render. */
function hashSeed(...parts: Array<string | number>): number {
  let hash = 0;
  const input = parts.join("|");
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function createTrajectory(owner: string, generation: number): { angle: number; impactParameter: number } {
  return {
    angle: seededRandom(hashSeed(owner, generation, "angle")) * Math.PI * 2,
    impactParameter: IMPACT_MIN + seededRandom(hashSeed(owner, generation, "impact")) * (IMPACT_MAX - IMPACT_MIN)
  };
}

function createNodeState(owner: string): NodeAnimState {
  const durationMs = DURATION_MS_MIN + seededRandom(hashSeed(owner, "duration")) * (DURATION_MS_MAX - DURATION_MS_MIN);
  return {
    ...createTrajectory(owner, 0),
    z: Z_NEAR + seededRandom(hashSeed(owner, "z0")) * (Z_FAR - Z_NEAR),
    speedPerMs: (Z_FAR - Z_NEAR) / durationMs,
    generation: 0
  };
}

function nodeSize(z: number): number {
  const progress = clamp((Z_FAR - z) / (Z_FAR - Z_NEAR), 0, 1);
  return NODE_MIN_SIZE_PX + progress * (NODE_MAX_SIZE_PX - NODE_MIN_SIZE_PX);
}

/** Projects a node's fixed trajectory (angle + impact parameter) at its current depth into container pixels, radiating from dead-center. */
function nodePixelPosition(state: Pick<NodeAnimState, "angle" | "impactParameter" | "z">, containerSize: { width: number; height: number }) {
  const scale = Math.min(containerSize.width, containerSize.height) / 2;
  const radius = (state.impactParameter / state.z) * scale;
  return { x: containerSize.width / 2 + Math.cos(state.angle) * radius, y: containerSize.height / 2 + Math.sin(state.angle) * radius };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** A stable seeded shuffle-and-slice, so the same pool of owners always yields the same sample instead of reshuffling on every unrelated render. */
function pickSeededSample(pool: ConstellationNode[], count: number, seedSuffix: string): ConstellationNode[] {
  return [...pool].sort((a, b) => seededRandom(hashSeed(a.owner, seedSuffix)) - seededRandom(hashSeed(b.owner, seedSuffix))).slice(0, count);
}

/**
 * Samples the visible field so it skews toward providers with something to show on hover, rather than an even random cut
 * that would mostly land on empty ones. Falls back to backfilling from whichever pool has room when one side runs short.
 */
export function pickVisibleNodes(nodes: ConstellationNode[]): ConstellationNode[] {
  if (nodes.length <= MAX_VISIBLE_PROVIDER_NODES) return nodes;

  const withDeployments = nodes.filter(node => node.hasActiveDeployments);
  const withoutDeployments = nodes.filter(node => !node.hasActiveDeployments);
  const targetWithDeployments = Math.round(MAX_VISIBLE_PROVIDER_NODES * VISIBLE_WITH_DEPLOYMENTS_SHARE);

  const picked = [
    ...pickSeededSample(withDeployments, targetWithDeployments, "visible"),
    ...pickSeededSample(withoutDeployments, MAX_VISIBLE_PROVIDER_NODES - targetWithDeployments, "visible")
  ];

  const shortfall = MAX_VISIBLE_PROVIDER_NODES - picked.length;
  if (shortfall > 0) {
    const pickedOwners = new Set(picked.map(node => node.owner));
    const remaining = nodes.filter(node => !pickedOwners.has(node.owner));
    picked.push(...pickSeededSample(remaining, shortfall, "visible-backfill"));
  }

  return picked;
}

export type EcosystemConstellationProps = {
  nodes: ConstellationNode[];
};

export const EcosystemConstellation: FC<EcosystemConstellationProps> = ({ nodes }) => {
  const visibleNodes = useMemo(() => pickVisibleNodes(nodes), [nodes]);

  const containerRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const nodeStateRef = useRef<Map<string, NodeAnimState>>();
  if (!nodeStateRef.current) {
    nodeStateRef.current = new Map(visibleNodes.map(node => [node.owner, createNodeState(node.owner)]));
  }

  const [activeOwner, setActiveOwner] = useState<string | null>(null);
  const activeOwnerRef = useRef<string | null>(null);
  /** The provider whose deployment satellites are currently shown. Unlike activeOwner, this doesn't clear the instant the cursor leaves the node - it only changes when a different node is hovered, so the lines can stretch out to the cursor instead of vanishing. */
  const [stickyOwner, setStickyOwner] = useState<string | null>(null);
  const stickyOwnerRef = useRef<string | null>(null);
  /** A different node only steals sticky away from an existing one after being the closest node for this long - otherwise the cursor merely passing near another node while moving away would instantly cut off the current trail. The very first assignment (no existing sticky) skips this and is instant. */
  const pendingStickyOwnerRef = useRef<{ owner: string; sinceMs: number } | null>(null);
  /** When the cursor stops literally being on the sticky hub, this records when that started - if it stays that way past DISENGAGE_TIMEOUT_MS without landing on a different node, the hub is let go (same effect as leaving the canvas). */
  const awaySinceRef = useRef<number | null>(null);
  /** Snapshots of abandoned satellite clusters, each fading out independently after the provider they belonged to stops being sticky. */
  const [fadingClusters, setFadingClusters] = useState<FadingCluster[]>([]);
  const convergencePointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState<{ width: number; height: number } | null>(null);
  const containerSizeRef = useRef<{ width: number; height: number } | null>(null);

  const rafRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const pointerClientRef = useRef<{ x: number; y: number } | null>(null);

  const handleSatelliteAbandoned = useCallback((satellites: SatelliteShape[]) => {
    if (satellites.length === 0) return;
    setFadingClusters(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, satellites }]);
  }, []);

  const removeFadingCluster = useCallback((id: string) => {
    setFadingClusters(prev => prev.filter(cluster => cluster.id !== id));
  }, []);

  useEffect(() => {
    activeOwnerRef.current = activeOwner;
  }, [activeOwner]);

  useEffect(() => {
    stickyOwnerRef.current = stickyOwner;
  }, [stickyOwner]);

  useEffect(() => {
    containerSizeRef.current = containerSize;
  }, [containerSize]);

  useEffect(() => {
    const map = nodeStateRef.current;
    if (!map) return;

    const currentOwners = new Set(visibleNodes.map(node => node.owner));
    for (const owner of map.keys()) {
      if (!currentOwners.has(owner)) map.delete(owner);
    }
    for (const node of visibleNodes) {
      if (!map.has(node.owner)) map.set(node.owner, createNodeState(node.owner));
    }
  }, [visibleNodes]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(entries => {
      const rect = entries[0]?.contentRect;
      if (rect) setContainerSize({ width: rect.width, height: rect.height });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handlePointerActivity(event: PointerEvent) {
      pointerClientRef.current = { x: event.clientX, y: event.clientY };
      const dot = cursorDotRef.current;
      if (dot) {
        const rect = container.getBoundingClientRect();
        dot.style.left = `${event.clientX - rect.left}px`;
        dot.style.top = `${event.clientY - rect.top}px`;
        dot.style.opacity = "1";
      }
    }
    function handlePointerLeave() {
      pointerClientRef.current = null;
      stickyOwnerRef.current = null;
      setStickyOwner(null);
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = "0";
    }

    container.addEventListener("pointermove", handlePointerActivity);
    container.addEventListener("pointerdown", handlePointerActivity);
    container.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      container.removeEventListener("pointermove", handlePointerActivity);
      container.removeEventListener("pointerdown", handlePointerActivity);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const nodeStates = nodeStateRef.current;
    if (!container || !nodeStates) return;

    lastFrameTimeRef.current = null;

    function tick(now: number) {
      if (!container || !nodeStates) return;
      const frameDelta = lastFrameTimeRef.current === null ? 0 : now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      const containerSizeNow = containerSizeRef.current;
      if (!containerSizeNow) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const pointer = pointerClientRef.current;
      const rect = pointer ? container.getBoundingClientRect() : null;
      let closestOwner: string | null = null;
      let closestDistance = Infinity;
      const halfMaxSize = NODE_MAX_SIZE_PX / 2;

      for (const node of visibleNodes) {
        const state = nodeStates.get(node.owner);
        if (!state) continue;

        const isSticky = node.owner === stickyOwnerRef.current;
        if (!isSticky) state.z -= state.speedPerMs * frameDelta;

        let pos = nodePixelPosition(state, containerSizeNow);
        const outOfBounds =
          pos.x < halfMaxSize || pos.x > containerSizeNow.width - halfMaxSize || pos.y < halfMaxSize || pos.y > containerSizeNow.height - halfMaxSize;
        if (!isSticky && (outOfBounds || state.z <= Z_NEAR)) {
          state.generation += 1;
          Object.assign(state, createTrajectory(node.owner, state.generation));
          state.z = Z_FAR;
          pos = nodePixelPosition(state, containerSizeNow);
        }

        const size = isSticky ? NODE_ACTIVE_SIZE_PX : nodeSize(state.z);
        const el = dotRefs.current.get(node.owner);
        if (el) {
          el.style.left = `${pos.x}px`;
          el.style.top = `${pos.y}px`;
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
          el.style.backgroundColor = isSticky ? NODE_ACTIVE_COLOR : NODE_COLOR;
        }

        if (pointer && rect) {
          const pixelX = rect.left + pos.x;
          const pixelY = rect.top + pos.y;
          const distance = Math.hypot(pixelX - pointer.x, pixelY - pointer.y);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestOwner = node.owner;
          }
        }
      }

      const nextActive = pointer && closestDistance <= ACTIVE_RADIUS_PX ? closestOwner : null;
      if (nextActive !== activeOwnerRef.current) {
        activeOwnerRef.current = nextActive;
        setActiveOwner(nextActive);
      }

      function claimSticky(owner: string) {
        stickyOwnerRef.current = owner;
        setStickyOwner(owner);
        pendingStickyOwnerRef.current = null;
        awaySinceRef.current = null;
        const newState = nodeStates.get(owner);
        if (newState) convergencePointRef.current = nodePixelPosition(newState, containerSizeNow);
      }

      if (nextActive === null || nextActive === stickyOwnerRef.current) {
        pendingStickyOwnerRef.current = null;
      } else if (stickyOwnerRef.current === null) {
        claimSticky(nextActive);
      } else if (pendingStickyOwnerRef.current?.owner !== nextActive) {
        pendingStickyOwnerRef.current = { owner: nextActive, sinceMs: now };
      } else if (now - pendingStickyOwnerRef.current.sinceMs >= STICKY_REASSIGN_DWELL_MS) {
        claimSticky(nextActive);
      }

      const stickyState = stickyOwnerRef.current ? nodeStates.get(stickyOwnerRef.current) : undefined;
      if (stickyState) {
        const isLiterallyActive = activeOwnerRef.current === stickyOwnerRef.current;

        if (isLiterallyActive) {
          awaySinceRef.current = null;
        } else if (awaySinceRef.current === null) {
          awaySinceRef.current = now;
        } else if (now - awaySinceRef.current >= DISENGAGE_TIMEOUT_MS) {
          stickyOwnerRef.current = null;
          setStickyOwner(null);
          awaySinceRef.current = null;
        }

        const hubPos = nodePixelPosition(stickyState, containerSizeNow);
        const rawTarget = pointer && rect ? { x: pointer.x - rect.left, y: pointer.y - rect.top } : hubPos;
        const followDistance = Math.hypot(rawTarget.x - hubPos.x, rawTarget.y - hubPos.y);
        const easeTarget = followDistance > LINE_FOLLOW_RADIUS_PX ? hubPos : rawTarget;

        convergencePointRef.current = {
          x: convergencePointRef.current.x + (easeTarget.x - convergencePointRef.current.x) * CONVERGENCE_EASE_FACTOR,
          y: convergencePointRef.current.y + (easeTarget.y - convergencePointRef.current.y) * CONVERGENCE_EASE_FACTOR
        };
      } else {
        awaySinceRef.current = null;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [visibleNodes]);

  const activeNode = useMemo(() => visibleNodes.find(n => n.owner === activeOwner) ?? null, [visibleNodes, activeOwner]);
  const activeNodePixels = useMemo(() => {
    if (!activeNode || !containerSize) return null;
    const state = nodeStateRef.current?.get(activeNode.owner);
    if (!state) return null;
    return nodePixelPosition(state, containerSize);
  }, [activeNode, containerSize]);

  const stickyNode = useMemo(() => visibleNodes.find(n => n.owner === stickyOwner) ?? null, [visibleNodes, stickyOwner]);
  const stickyNodePixels = useMemo(() => {
    if (!stickyNode || !containerSize) return null;
    const state = nodeStateRef.current?.get(stickyNode.owner);
    if (!state) return null;
    return nodePixelPosition(state, containerSize);
  }, [stickyNode, containerSize]);

  return (
    <div ref={containerRef} className="dark relative h-[calc(100vh-180px)] min-h-[480px] w-full cursor-none rounded-xl border bg-card">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl" aria-hidden="true">
        {containerSize &&
          visibleNodes.map(node => {
            const state = nodeStateRef.current?.get(node.owner);
            if (!state) return null;
            const pos = nodePixelPosition(state, containerSize);
            const size = nodeSize(state.z);
            return (
              <span
                key={node.owner}
                ref={el => {
                  if (el) dotRefs.current.set(node.owner, el);
                  else dotRefs.current.delete(node.owner);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-200"
                style={{ left: pos.x, top: pos.y, width: size, height: size, backgroundColor: NODE_COLOR }}
              />
            );
          })}

        {containerSize &&
          fadingClusters.map(cluster => (
            <FadingSatellites
              key={cluster.id}
              satellites={cluster.satellites}
              containerSize={containerSize}
              onComplete={() => removeFadingCluster(cluster.id)}
            />
          ))}

        {stickyNode && stickyNodePixels && containerSize && (
          <DeploymentSatellites
            key={stickyNode.owner}
            hub={stickyNode}
            hubPixels={stickyNodePixels}
            containerSize={containerSize}
            convergencePointRef={convergencePointRef}
            onAbandoned={handleSatelliteAbandoned}
          />
        )}
      </div>

      {activeNode && activeNodePixels && (
        <Tooltip open onOpenChange={() => {}}>
          <TooltipTrigger asChild>
            <span className="pointer-events-none absolute size-px" style={{ left: activeNodePixels.x, top: activeNodePixels.y }} />
          </TooltipTrigger>
          <TooltipContent side="top">{activeNode.name}</TooltipContent>
        </Tooltip>
      )}

      <div
        ref={cursorDotRef}
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0"
        style={{ width: CURSOR_DOT_SIZE_PX, height: CURSOR_DOT_SIZE_PX, boxShadow: "0 0 6px rgba(255, 255, 255, 0.7)" }}
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute left-4 right-4 top-4 grid grid-cols-[1fr_auto_1fr] items-start gap-x-4 font-mono">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">{nodes.length} online providers</span>
        <span className="whitespace-nowrap text-center text-xs text-muted-foreground/70">Hover a node to reveal the provider and its live deployments.</span>
        <div className="flex shrink-0 items-center gap-4 justify-self-end text-xs uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 shrink-0 rounded-full bg-white/80" />
            providers
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 shrink-0 rounded-[1px] bg-white/80" />
            deployments
          </span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" size="sm" className="cursor-pointer font-mono hover:no-underline">
              Become a Provider
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Two ways to provide</DialogTitle>
              <DialogDescription>Both put capacity onto the same Akash marketplace. Pick the one that matches the hardware you have.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <ProviderOptionCard
                eyebrow="Consumer GPU"
                title="Akash HomeNode"
                body="For a single graphics card in a machine you already own. HomeNode is the way in if what you have spare is GPU time rather than rack space."
                cta="Set up a HomeNode"
                href="http://homenode.akash.network/"
              />
              <ProviderOptionCard
                eyebrow="Data center capacity"
                title="Provider Console"
                body="For whole machines - CPU, memory, storage and GPUs offered together. Stand that capacity up as an Akash provider and start accepting workloads."
                cta="Open Provider Console"
                href="https://provider-console.akash.network/"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {activeNode && <ActiveProviderPanel node={activeNode} />}
    </div>
  );
};

type Satellite = SatelliteShape & { entranceDelayMs: number };

function setSatelliteOpacity(line: SVGLineElement | undefined, rect: SVGRectElement | undefined, value: 0 | 1, transitionMs: number) {
  const transition = `opacity ${transitionMs}ms cubic-bezier(0.4, 0, 0.2, 1)`;
  if (line) {
    line.style.transition = transition;
    line.style.opacity = String(value);
  }
  if (rect) {
    rect.style.transition = transition;
    rect.style.opacity = String(value);
  }
}

/**
 * Renders one small rectangle per active deployment, radiating from the hovered provider - a live head count, not just a stat.
 * Satellite positions/sizes are fixed relative to the hub (clamped to the container so a hub near the edge never pushes them
 * out of view). Most fade in almost immediately; if there are many, the rest stream in one by one over a short window. Each
 * line's near end tracks convergencePointRef every frame - when the cursor drifts away from the hub the lines stretch toward
 * it (a trail effect) for as long as this provider stays sticky. The moment a different provider takes over sticky, this
 * component unmounts and hands its current satellite layout to onAbandoned, which renders it as an independent fading ghost -
 * so the lines vanish immediately (they belonged to the live connection) while the satellite shapes linger and dissolve.
 */
const DeploymentSatellites: FC<{
  hub: ConstellationNode;
  hubPixels: { x: number; y: number };
  containerSize: { width: number; height: number };
  convergencePointRef: RefObject<{ x: number; y: number }>;
  onAbandoned: (satellites: SatelliteShape[]) => void;
}> = ({ hub, hubPixels, containerSize, convergencePointRef, onAbandoned }) => {
  const { data } = useProviderDashboard(hub.owner);
  const activeLeaseCount = data?.current.activeLeaseCount ?? 0;
  const lineRefs = useRef<Map<number, SVGLineElement>>(new Map());
  const rectRefs = useRef<Map<number, SVGRectElement>>(new Map());
  const rafRef = useRef<number | null>(null);

  const satellites = useMemo<Satellite[]>(() => {
    const shown = Math.min(activeLeaseCount, MAX_SATELLITES);
    const clampMargin = SATELLITE_SIZE_MAX_PX / 2;
    return Array.from({ length: shown }, (_, i) => {
      const baseAngle = (i / shown) * Math.PI * 2;
      const angleJitter = (seededRandom(hashSeed(hub.owner, i, "angle")) - 0.5) * ((Math.PI * 2) / shown) * 0.8;
      const radius = SATELLITE_MIN_RADIUS_PX + seededRandom(hashSeed(hub.owner, i, "radius")) * (SATELLITE_MAX_RADIUS_PX - SATELLITE_MIN_RADIUS_PX);
      const angle = baseAngle + angleJitter;
      const entranceFraction = Math.pow(seededRandom(hashSeed(hub.owner, i, "entrance")), SATELLITE_ENTRANCE_BIAS_EXPONENT);
      return {
        x: clamp(hubPixels.x + Math.cos(angle) * radius, clampMargin, containerSize.width - clampMargin),
        y: clamp(hubPixels.y + Math.sin(angle) * radius, clampMargin, containerSize.height - clampMargin),
        width: SATELLITE_SIZE_MIN_PX + seededRandom(hashSeed(hub.owner, i, "w")) * (SATELLITE_SIZE_MAX_PX - SATELLITE_SIZE_MIN_PX),
        height: SATELLITE_SIZE_MIN_PX + seededRandom(hashSeed(hub.owner, i, "h")) * (SATELLITE_SIZE_MAX_PX - SATELLITE_SIZE_MIN_PX),
        entranceDelayMs: entranceFraction * shown * SATELLITE_ENTRANCE_STAGGER_MS
      };
    });
  }, [hub.owner, hubPixels.x, hubPixels.y, containerSize.width, containerSize.height, activeLeaseCount]);

  useEffect(() => {
    if (satellites.length === 0) return;

    const timeoutIds = satellites.map((satellite, i) =>
      setTimeout(() => {
        setSatelliteOpacity(lineRefs.current.get(i), rectRefs.current.get(i), 1, SATELLITE_FADE_IN_MS);
      }, satellite.entranceDelayMs)
    );

    return () => timeoutIds.forEach(clearTimeout);
  }, [satellites]);

  const latestSatellitesRef = useRef(satellites);
  useEffect(() => {
    latestSatellitesRef.current = satellites;
  }, [satellites]);

  useEffect(() => {
    // Empty deps deliberately - this must fire only on genuine unmount (a different provider taking over sticky),
    // not on every satellite recompute (e.g. a lease-count refresh) for the same still-active hub.
    return () => onAbandoned(latestSatellitesRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function tick() {
      const point = convergencePointRef.current;
      lineRefs.current.forEach(line => {
        line.setAttribute("x1", String(point.x));
        line.setAttribute("y1", String(point.y));
      });
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [convergencePointRef]);

  if (satellites.length === 0) return null;

  const initialStyle = { opacity: 0, transition: `opacity ${SATELLITE_FADE_IN_MS}ms cubic-bezier(0.4, 0, 0.2, 1)` };

  return (
    <svg className="absolute left-0 top-0" width={containerSize.width} height={containerSize.height} aria-hidden="true">
      {satellites.map((satellite, i) => (
        <line
          key={i}
          ref={el => {
            if (el) lineRefs.current.set(i, el);
            else lineRefs.current.delete(i);
          }}
          x1={hubPixels.x}
          y1={hubPixels.y}
          x2={satellite.x}
          y2={satellite.y}
          stroke="white"
          strokeOpacity={0.22}
          strokeWidth={0.75}
          style={initialStyle}
        />
      ))}
      {satellites.map((satellite, i) => (
        <rect
          key={i}
          ref={el => {
            if (el) rectRefs.current.set(i, el);
            else rectRefs.current.delete(i);
          }}
          x={satellite.x - satellite.width / 2}
          y={satellite.y - satellite.height / 2}
          width={satellite.width}
          height={satellite.height}
          rx={1}
          fill="white"
          fillOpacity={0.8}
          style={initialStyle}
        />
      ))}
    </svg>
  );
};

/**
 * A snapshot of a satellite cluster left behind when its provider stops being sticky - frozen in place (no lines, no
 * cursor-following). Each satellite waits its own random delay, then fades out on its own transition, so the cluster
 * dissolves one by one instead of blinking out together. Reports completion once every satellite has finished fading,
 * so the parent can drop it.
 */
const FadingSatellites: FC<{
  satellites: SatelliteShape[];
  containerSize: { width: number; height: number };
  onComplete: () => void;
}> = ({ satellites, containerSize, onComplete }) => {
  const rectRefs = useRef<Map<number, SVGRectElement>>(new Map());

  useEffect(() => {
    const timeoutIds = satellites.map((_, i) =>
      setTimeout(() => {
        const rect = rectRefs.current.get(i);
        if (rect) {
          rect.style.transition = `opacity ${GHOST_FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;
          rect.style.opacity = "0";
        }
      }, Math.random() * GHOST_STAGGER_MAX_MS)
    );
    const completeTimer = setTimeout(onComplete, GHOST_STAGGER_MAX_MS + GHOST_FADE_MS + 100);
    return () => {
      timeoutIds.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onComplete identity is stable per cluster id; re-running this on every parent render would restart the fade
  }, []);

  return (
    <svg className="pointer-events-none absolute left-0 top-0" width={containerSize.width} height={containerSize.height} aria-hidden="true">
      {satellites.map((satellite, i) => (
        <rect
          key={i}
          ref={el => {
            if (el) rectRefs.current.set(i, el);
            else rectRefs.current.delete(i);
          }}
          x={satellite.x - satellite.width / 2}
          y={satellite.y - satellite.height / 2}
          width={satellite.width}
          height={satellite.height}
          rx={1}
          fill="white"
          fillOpacity={0.8}
        />
      ))}
    </svg>
  );
};

const ActiveProviderPanel: FC<{ node: ConstellationNode }> = ({ node }) => {
  const { data, status } = useProviderDashboard(node.owner);
  const memory = data ? bytesToShrink(Number(data.current.activeMemory), true) : null;
  const storage = data ? bytesToShrink(Number(data.current.activeEphemeralStorage) + Number(data.current.activePersistentStorage), true) : null;

  return (
    <div className="pointer-events-none absolute bottom-4 left-4 right-4 rounded-lg border bg-card/95 p-4 sm:right-auto sm:w-[22rem]">
      <p className="text-sm font-semibold text-foreground">{node.name}</p>
      <p className="text-xs text-muted-foreground">{node.region}</p>

      {node.gpuModels.length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">
          {Array.from(new Set(node.gpuModels.map(gpu => formatGpuModelName(gpu.vendor, gpu.model, gpu.ram)))).join(" · ")}
        </p>
      )}

      <div className="mt-3 border-t pt-3">
        {status === "pending" && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Spinner size="small" />
            Loading live deployments…
          </div>
        )}

        {status === "error" && <p className="text-xs text-muted-foreground">Deployment data unavailable right now.</p>}

        {status === "success" && data && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <Stat label="Active deployments" value={<FormattedNumber value={data.current.activeLeaseCount} />} />
            <Stat label="Total deployments" value={<FormattedNumber value={data.current.totalLeaseCount} />} />
            <Stat label="Active vCPU" value={<FormattedNumber value={data.current.activeCPU / 1000} maximumFractionDigits={1} />} />
            <Stat label="Active GPUs" value={<FormattedNumber value={data.current.activeGPU} />} />
            {memory && (
              <Stat
                label="Active memory"
                value={
                  <>
                    <FormattedNumber value={memory.value} maximumFractionDigits={1} /> {memory.unit}
                  </>
                }
              />
            )}
            {storage && (
              <Stat
                label="Active storage"
                value={
                  <>
                    <FormattedNumber value={storage.value} maximumFractionDigits={1} /> {storage.unit}
                  </>
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Stat: FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="font-semibold tabular-nums text-foreground">{value}</p>
  </div>
);

const ProviderOptionCard: FC<{ eyebrow: string; title: string; body: string; cta: string; href: string }> = ({ eyebrow, title, body, cta, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="group flex flex-col rounded-lg border p-4 transition-colors hover:border-foreground/30 hover:bg-accent hover:no-underline"
  >
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{eyebrow}</p>
    <p className="mt-1 text-base font-semibold text-foreground">{title}</p>
    <p className="mt-2 flex-1 text-sm text-muted-foreground">{body}</p>
    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
      {cta}
      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
    </span>
  </a>
);
