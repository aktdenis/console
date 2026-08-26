import React from "react";
import { Button, Card, CardContent } from "@akashnetwork/ui/components";
import Image from "next/image";
import Link from "next/link";

export const BecomeProviderTile: React.FunctionComponent = () => (
  <Card className="dark overflow-hidden rounded-xl">
    <CardContent className="flex h-full flex-col p-0">
      <div className="relative aspect-[5/2] w-full shrink-0">
        <Image
          src="/images/compute-provider.webp"
          alt="Rack-mounted servers in a data center"
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 400px, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between gap-3 p-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Data center capacity</span>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-foreground">Become a provider</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            For whole machines — CPU, memory, storage and GPUs offered together. Provider Console is where you stand that capacity up as an Akash provider and
            start accepting workloads.
          </p>
        </div>
        <Button asChild className="w-fit hover:no-underline">
          <Link href="https://provider-console.akash.network/" target="_blank" rel="noreferrer">
            Open Provider Console
          </Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);
