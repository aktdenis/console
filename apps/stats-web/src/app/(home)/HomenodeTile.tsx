import React from "react";
import { Button, Card, CardContent } from "@akashnetwork/ui/components";
import Image from "next/image";
import Link from "next/link";

export const HomenodeTile: React.FunctionComponent = () => (
  <Card className="dark overflow-hidden rounded-xl">
    <CardContent className="flex h-full flex-col p-0">
      <div className="relative aspect-[5/2] w-full shrink-0">
        <Image
          src="/images/homenode-provider.webp"
          alt="A single consumer GPU in a home desktop machine"
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 400px, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-3 p-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Consumer GPU</span>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-foreground">Akash HomeNode</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            For a single graphics card in a machine you already own — a 4090 or 5090 under your desk. HomeNode is the way in if what you have spare is GPU time
            rather than rack space.
          </p>
        </div>
        <Button asChild className="w-fit hover:no-underline">
          <Link href="http://homenode.akash.network/" target="_blank" rel="noreferrer">
            Set up a HomeNode
          </Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);
