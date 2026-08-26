import { Button } from "@akashnetwork/ui/components";
import Image from "next/image";
import Link from "next/link";

import { AnimatedPixelBackground } from "@/components/hero/AnimatedPixelBackground";

export const BottomCta: React.FunctionComponent = () => (
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
      <div className="flex flex-col items-center gap-4 rounded-lg bg-card/95 p-4">
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Deploy on Akash.</h2>
        <p className="max-w-xl text-muted-foreground">
          Rent compute from the same open marketplace this dashboard tracks — GPUs, CPUs, and storage, priced by the network, not a sales team.
        </p>
      </div>
      <Button asChild size="lg" className="hover:no-underline">
        <Link href="https://console.akash.network" target="_blank" rel="noreferrer">
          Deploy Now
        </Link>
      </Button>

      <div className="relative mt-6 aspect-video w-full max-w-3xl overflow-hidden rounded-t-xl border border-b-0">
        <Image
          src="/images/akash-console.webp"
          alt="Configuring a deployment in Akash Console"
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 768px, 100vw"
        />
      </div>
    </div>
  </div>
);
