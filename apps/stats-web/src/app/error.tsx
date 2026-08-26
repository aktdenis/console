"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "@akashnetwork/ui/components";

import { PageContainer } from "@/components/PageContainer";
import { Title } from "@/components/Title";
import { errorHandler } from "@/services/di";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    errorHandler.reportError({ error });
  }, [error]);

  return (
    <PageContainer className="flex flex-col items-center justify-center gap-2 py-24 text-center">
      <Title>This page hit a snag</Title>
      <p className="text-muted-foreground">Refreshing usually fixes it.</p>
      <Button
        className="mt-4"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </PageContainer>
  );
}
