import type { Metadata } from "next";

import { BlockchainContainer } from "./BlockchainContainer";

import { PageContainer } from "@/components/PageContainer";

export const metadata: Metadata = {
  title: "Blockchain"
};

export default function BlockchainPage() {
  return (
    <PageContainer>
      <BlockchainContainer />
    </PageContainer>
  );
}
