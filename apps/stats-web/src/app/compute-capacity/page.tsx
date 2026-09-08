import type { Metadata } from "next";

import { ComputeCapacityContainer } from "./ComputeCapacityContainer";

import { PageContainer } from "@/components/PageContainer";

export const metadata: Metadata = {
  title: "Compute Capacity"
};

export default function ComputeCapacityPage() {
  return (
    <PageContainer>
      <ComputeCapacityContainer />
    </PageContainer>
  );
}
