"use client";
import { type FC, type ReactNode, useState } from "react";
import { Button, Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@akashnetwork/ui/components";
import { Discord, Github, X as TwitterX, Youtube } from "iconoir-react";
import { ArrowUpRight, Check, Menu, X } from "lucide-react";
import Image from "next/image";

import { LiveClock } from "@/components/layout/LiveClock";
import { ProvideComputeDialog } from "@/components/layout/ProvideComputeDialog";
import { ThemeToggleGroup } from "@/components/layout/ThemeToggleGroup";
import { WorldMapDots } from "@/components/layout/WorldMapDots";
import { filterOnlineProvidersWithCoords, toMarkers } from "@/lib/providerGeo";
import { cn } from "@/lib/utils";
import { useProviders } from "@/queries";
import { networkStore } from "@/store/network.store";

type ProductTile = {
  key: string;
  title: string;
  description: string;
  href: string;
  image: string;
  renderLogo: () => ReactNode;
};

const PRODUCT_TILES: ProductTile[] = [
  {
    key: "deploy",
    title: "Deploy Now",
    description: "Deploy via Template, Public or Private Repo.",
    href: "https://console.akash.network",
    image: "/images/getting-started/deploy-now.png",
    renderLogo: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <img src="/images/getting-started/logos/deploy-now-logo.svg" alt="" className="h-[25px] w-[28px]" />
      </div>
    )
  },
  {
    key: "inference",
    title: "Run AI Inference",
    description: "High-performance managed API - AI inference service.",
    href: "https://playground.akashml.com",
    image: "/images/getting-started/run-ai-inference.png",
    renderLogo: () => <img src="/images/getting-started/logos/run-ai-inference-logo.svg" alt="" className="absolute inset-[35%_22%_33%_25%]" />
  }
];

const PROVIDE_COMPUTE_TILE = {
  title: "Provide Compute",
  description: "Monetize your Compute by Joining the Network.",
  image: "/images/getting-started/provide-compute.png",
  renderLogo: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <img src="/images/getting-started/logos/provide-compute-logo.svg" alt="" className="h-[25px] w-[28px]" />
    </div>
  )
};

const DEVELOPER_RESOURCES = [{ key: "docs", label: "Akash Documentation", href: "https://akash.network/docs" }];

const SOCIAL_LINKS = [
  { key: "twitter", label: "Twitter", href: "https://twitter.com/akashnet", Icon: TwitterX },
  { key: "github", label: "GitHub", href: "https://github.com/akash-network/console", Icon: Github },
  { key: "discord", label: "Discord", href: "https://discord.akash.network", Icon: Discord },
  { key: "youtube", label: "YouTube", href: "https://www.youtube.com/@AkashNetwork", Icon: Youtube }
] as const;

const ROW_CLASSNAME =
  "flex h-8 items-center gap-2 rounded-md px-2 text-xs font-medium text-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground hover:no-underline focus-visible:bg-accent focus-visible:text-accent-foreground";

export const GettingStartedMenu: FC = () => {
  const [open, setOpen] = useState(false);
  const [provideComputeOpen, setProvideComputeOpen] = useState(false);
  const { data: providers, status: providersStatus } = useProviders();
  const [{ isLoading: isLoadingNetworks, data: networks }] = networkStore.useNetworksStore();
  const [selectedNetworkId, setSelectedNetworkId] = networkStore.useSelectedNetworkIdStore({ reloadOnChange: true });

  const onlineProviders = providers ? filterOnlineProvidersWithCoords(providers) : [];
  const markers = toMarkers(onlineProviders);
  const onlineLabel =
    providersStatus === "success"
      ? `${onlineProviders.length} providers online`
      : providersStatus === "error"
        ? "Provider status unavailable"
        : "Checking provider status…";
  const availableNetworks = networks.filter(network => network.enabled);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" hideCloseButton className="flex w-[336px] max-w-[90vw] flex-col gap-0 p-0">
        <div className="flex shrink-0 items-center justify-between p-6 pb-0">
          <SheetTitle className="text-sm font-medium text-muted-foreground">Menu</SheetTitle>
          <SheetClose asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-md">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-6">
          <div className="flex flex-col gap-3">
            {PRODUCT_TILES.map(tile => (
              <a
                key={tile.key}
                href={tile.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-xl bg-muted p-3 transition-colors hover:bg-muted/70 hover:no-underline"
              >
                <div className="relative size-[69px] shrink-0 overflow-hidden rounded-sm bg-background">
                  <Image src={tile.image} alt="" fill className="scale-110 object-cover" sizes="69px" />
                  {tile.renderLogo()}
                </div>
                <div className="flex flex-1 items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-foreground">{tile.title}</p>
                    <p className="text-xs text-muted-foreground">{tile.description}</p>
                  </div>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </a>
            ))}

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setProvideComputeOpen(true);
              }}
              className="group flex items-center gap-3 rounded-xl bg-muted p-3 text-left transition-colors hover:bg-muted/70"
            >
              <div className="relative size-[69px] shrink-0 overflow-hidden rounded-sm bg-background">
                <Image src={PROVIDE_COMPUTE_TILE.image} alt="" fill className="scale-110 object-cover" sizes="69px" />
                {PROVIDE_COMPUTE_TILE.renderLogo()}
              </div>
              <div className="flex flex-1 items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-foreground">{PROVIDE_COMPUTE_TILE.title}</p>
                  <p className="text-xs text-muted-foreground">{PROVIDE_COMPUTE_TILE.description}</p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </button>

            <a
              href="https://akash.network"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-center gap-2 rounded-xl bg-muted p-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/70 hover:no-underline"
            >
              akash.network
              <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="mt-auto flex flex-col divide-y divide-border pt-6">
            <section className="flex flex-col gap-1.5 pb-4">
              <p className="text-xs font-medium text-muted-foreground">Developer Resources</p>
              <div className="flex flex-col gap-1.5">
                {DEVELOPER_RESOURCES.map(resource => (
                  <a key={resource.key} href={resource.href} target="_blank" rel="noreferrer" className={cn(ROW_CLASSNAME, "group")}>
                    <span className="flex-1">{resource.label}</span>
                    <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </section>

            <section className="flex items-start gap-4 py-4">
              <div className="flex aspect-square flex-1 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl bg-muted p-3">
                <WorldMapDots markers={markers} className="h-full w-full" />
                <div className="flex items-center gap-1.5 whitespace-nowrap text-[10px] font-medium text-foreground">
                  <span className={cn("size-1.5 shrink-0 rounded-full", providersStatus === "success" ? "bg-success" : "bg-muted-foreground")} />
                  {onlineLabel}
                </div>
              </div>
              <div className="aspect-square flex-1 overflow-hidden rounded-xl bg-muted p-3">
                <LiveClock timeZone="Europe/Paris" timeZoneLabel="CET" className="size-full" />
              </div>
            </section>

            <section className="flex flex-col gap-3 py-4">
              <p className="text-xs font-medium text-muted-foreground">Network</p>
              <div className="border-t" />
              <div className="flex flex-col gap-1.5">
                {availableNetworks.map(network => (
                  <SheetClose asChild key={network.id}>
                    <button
                      type="button"
                      disabled={isLoadingNetworks}
                      onClick={() => setSelectedNetworkId(network.id)}
                      className={cn(ROW_CLASSNAME, "disabled:pointer-events-none disabled:opacity-50")}
                    >
                      <span className="flex-1 text-left">
                        {network.title} <span className="text-muted-foreground">- {network.version}</span>
                      </span>
                      {network.id === selectedNetworkId && <Check className="size-4 text-foreground" />}
                    </button>
                  </SheetClose>
                ))}
              </div>
            </section>

            <section className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                {SOCIAL_LINKS.map(social => (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Akash Network ${social.label}`}
                    className="text-foreground transition-colors hover:text-muted-foreground"
                  >
                    <social.Icon className="size-4" />
                  </a>
                ))}
              </div>
              <ThemeToggleGroup />
            </section>
          </div>
        </div>
      </SheetContent>

      <ProvideComputeDialog open={provideComputeOpen} onOpenChange={setProvideComputeOpen} />
    </Sheet>
  );
};
