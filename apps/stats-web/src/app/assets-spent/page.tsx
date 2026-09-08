import type { Metadata } from "next";

import { AssetsSpentContainer } from "./AssetsSpentContainer";

import { PageContainer } from "@/components/PageContainer";

export const metadata: Metadata = {
  title: "Assets Spent"
};

export default function AssetsSpentPage() {
  return (
    <PageContainer>
      <AssetsSpentContainer />
    </PageContainer>
  );
}
