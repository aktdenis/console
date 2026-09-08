import type { FC } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@akashnetwork/ui/components";

import { BecomeProviderTile } from "@/app/(home)/BecomeProviderTile";
import { HomenodeTile } from "@/app/(home)/HomenodeTile";

export type ProvideComputeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ProvideComputeDialog: FC<ProvideComputeDialogProps> = ({ open, onOpenChange }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Two ways to provide.</DialogTitle>
        <DialogDescription>Both put capacity onto the same Akash marketplace. Pick the one that matches the hardware you have.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 sm:grid-cols-2">
        <HomenodeTile />
        <BecomeProviderTile />
      </div>
    </DialogContent>
  </Dialog>
);
