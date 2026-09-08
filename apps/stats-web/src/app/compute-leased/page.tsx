import type { Metadata } from "next";

import { ComputeLeasedContainer } from "./ComputeLeasedContainer";

import { PageContainer } from "@/components/PageContainer";

export const metadata: Metadata = {
  title: "Compute Leased"
};

export default function ComputeLeasedPage() {
  return (
    <PageContainer>
      <ComputeLeasedContainer />
    </PageContainer>
  );
}
