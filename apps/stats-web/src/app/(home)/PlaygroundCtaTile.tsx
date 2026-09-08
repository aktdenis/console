import { Button } from "@akashnetwork/ui/components";
import Image from "next/image";
import Link from "next/link";

import { AnimatedPixelBackground } from "@/components/hero/AnimatedPixelBackground";

export const PlaygroundCtaTile: React.FunctionComponent = () => (
  <div className="dark relative flex h-full flex-col overflow-hidden rounded-xl border bg-card">
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

    <div className="relative flex flex-1 flex-col items-center gap-3 px-6 pt-10 text-center">
      <h2 className="max-w-md text-2xl font-bold tracking-tight text-foreground">Run inference on AkashML.</h2>
      <p className="max-w-sm text-sm text-muted-foreground">Create a free account, copy your API key, and point your SDK at one new base URL.</p>
      <Button asChild className="hover:no-underline">
        <Link href="https://playground.akashml.com" target="_blank" rel="noreferrer">
          Get Your API Key
        </Link>
      </Button>

      <div className="relative mt-4 aspect-[21/9] w-full flex-1 overflow-hidden rounded-t-xl border border-b-0">
        <Image src="/images/playground-wide.webp" alt="The AkashML playground" fill className="object-cover" sizes="(min-width: 1024px) 640px, 100vw" />
      </div>
    </div>
  </div>
);
