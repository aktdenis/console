import type { Metadata } from "next";

import { NetworkReportContainer } from "./NetworkReportContainer";

import { PageContainer } from "@/components/PageContainer";

export const metadata: Metadata = {
  title: "Report Mode"
};

export default function NetworkReportPage() {
  return (
    <PageContainer>
      <NetworkReportContainer />
    </PageContainer>
  );
}
