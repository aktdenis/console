"use client";
import { type FC, useMemo } from "react";
import { Spinner } from "@akashnetwork/ui/components";

import { EcosystemConstellation } from "@/components/charts/EcosystemConstellation/EcosystemConstellation";
import { buildConstellationNodes } from "@/lib/ecosystemConstellation";
import { useProviders } from "@/queries";

export const EcosystemConstellationContainer: FC = () => {
  const { data: providers, status } = useProviders();

  const nodes = useMemo(() => buildConstellationNodes(providers ?? []), [providers]);

  if (status === "pending") {
    return (
      <div className="flex h-[calc(100vh-180px)] min-h-[480px] items-center justify-center rounded-xl border">
        <Spinner size="large" />
      </div>
    );
  }

  if (status === "error" || nodes.length === 0) return null;

  return <EcosystemConstellation nodes={nodes} />;
};
