import type { FC } from "react";
import { Button } from "@akashnetwork/ui/components";
import Image from "next/image";

import { BecomeProviderDialog } from "@/components/BecomeProviderDialog";
import { AnimatedPixelBackground } from "@/components/hero/AnimatedPixelBackground";

export const NetworkProviderCta: FC = () => (
  <div className="dark relative overflow-hidden rounded-xl border bg-card">
    <AnimatedPixelBackground
      className="absolute inset-0"
      variant="square"
      color="#2b2b2b"
      pixelSize={2}
      patternScale={3}
      patternDensity={1.3}
      enableRipples
      rippleSpeed={0.7}
      rippleThickness={0.11}
      speed={0.8}
      edgeFade={0.2}
      transparent
    />

    <div className="relative flex flex-col items-center gap-4 px-6 pt-16 text-center">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Have idle GPUs or excess data center capacity?</h2>
      <p className="max-w-xl text-muted-foreground">Providers on the Akash network bid their spare capacity into the same marketplace this dashboard tracks.</p>
      <BecomeProviderDialog trigger={<Button className="hover:no-underline">Join the network as a provider</Button>} />

      <div className="relative mt-6 aspect-video w-full max-w-3xl overflow-hidden rounded-t-xl border border-b-0">
        <Image
          src="/images/gpu-provider.webp"
          alt="Rack-mounted GPU compute ready to provide on Akash"
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 768px, 100vw"
        />
      </div>
    </div>
  </div>
);
