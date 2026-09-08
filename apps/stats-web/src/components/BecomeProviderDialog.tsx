import type { FC, ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@akashnetwork/ui/components";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export type BecomeProviderDialogProps = {
  trigger: ReactNode;
};

export const BecomeProviderDialog: FC<BecomeProviderDialogProps> = ({ trigger }) => (
  <Dialog>
    <DialogTrigger asChild>{trigger}</DialogTrigger>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Two ways to provide</DialogTitle>
        <DialogDescription>Both put capacity onto the same Akash marketplace. Pick the one that matches the hardware you have.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-2 sm:grid-cols-2">
        <ProviderOptionCard
          image="/images/homenode-provider.webp"
          eyebrow="Consumer GPU"
          title="Akash HomeNode"
          body="For a single graphics card in a machine you already own. HomeNode is the way in if what you have spare is GPU time rather than rack space."
          cta="Set up a HomeNode"
          href="http://homenode.akash.network/"
        />
        <ProviderOptionCard
          image="/images/compute-provider.webp"
          eyebrow="Data center capacity"
          title="Provider Console"
          body="For whole machines - CPU, memory, storage and GPUs offered together. Stand that capacity up as an Akash provider and start accepting workloads."
          cta="Open Provider Console"
          href="https://provider-console.akash.network/"
        />
      </div>
    </DialogContent>
  </Dialog>
);

const ProviderOptionCard: FC<{ image: string; eyebrow: string; title: string; body: string; cta: string; href: string }> = ({
  image,
  eyebrow,
  title,
  body,
  cta,
  href
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="group flex flex-col overflow-hidden rounded-lg border transition-colors hover:border-foreground/30 hover:bg-accent hover:no-underline"
  >
    <div className="relative aspect-[3/2] w-full shrink-0">
      <Image src={image} alt="" fill className="object-cover" sizes="(min-width: 640px) 320px, 100vw" />
    </div>
    <div className="flex flex-1 flex-col p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{eyebrow}</p>
      <p className="mt-1 text-base font-semibold text-foreground">{title}</p>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{body}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
        {cta}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </div>
  </a>
);
