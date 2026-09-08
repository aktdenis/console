"use client";
import { useState } from "react";
import { Spinner } from "@akashnetwork/ui/components";

import { StickyBottomNav } from "@/components/layout/StickyBottomNav";
import { AssetsSpentReport } from "@/components/NetworkReport/AssetsSpentReport";
import { BlockchainReport } from "@/components/NetworkReport/BlockchainReport";
import { BmeReport } from "@/components/NetworkReport/BmeReport";
import { CompareTool } from "@/components/NetworkReport/CompareTool";
import { ComputeLeasedReport } from "@/components/NetworkReport/ComputeLeasedReport";
import { DownloadPdfButton } from "@/components/NetworkReport/DownloadPdfButton";
import { ReferenceTablesSection } from "@/components/NetworkReport/ReferenceTablesSection";
import { ALL_REPORT_SECTION_KEYS, type ReportSectionKey } from "@/components/NetworkReport/reportSections";
import { ReportSectionsFilter } from "@/components/NetworkReport/ReportSectionsFilter";
import { type StatsViewMode, ViewModeToggle } from "@/components/NetworkReport/ViewModeToggle";
import { Title } from "@/components/Title";
import { useDashboardData } from "@/queries/useDashboardData";

export const NetworkReportContainer: React.FunctionComponent = () => {
  const [viewMode, setViewMode] = useState<StatsViewMode>("chart");
  const [visibleSections, setVisibleSections] = useState<ReportSectionKey[]>(ALL_REPORT_SECTION_KEYS);
  const { data: dashboardData, isLoading } = useDashboardData();
  const hasData = dashboardData?.now && dashboardData?.compare;

  function isVisible(key: ReportSectionKey) {
    return visibleSections.includes(key);
  }

  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <Title className="text-2xl font-semibold">Report Mode</Title>
          <p className="text-sm text-muted-foreground">A detailed report of every metric, as charts or as tables.</p>
        </div>
        <div className="no-print flex items-center gap-2">
          <ViewModeToggle value={viewMode} onValueChange={setViewMode} />
          <DownloadPdfButton />
        </div>
      </div>

      <div className="no-print mb-8">
        <ReportSectionsFilter selected={visibleSections} onChange={setVisibleSections} />
      </div>

      {hasData && (
        <div className="flex flex-col gap-10">
          {isVisible("compare") && <CompareTool viewMode={viewMode} />}

          {isVisible("assets-spent") && <AssetsSpentReport viewMode={viewMode} />}
          {isVisible("compute-leased") && <ComputeLeasedReport viewMode={viewMode} />}
          {isVisible("bme") && <BmeReport viewMode={viewMode} />}
          {isVisible("blockchain") && <BlockchainReport chainStats={dashboardData.chainStats} />}

          <ReferenceTablesSection
            now={dashboardData.now}
            networkCapacity={dashboardData.networkCapacity}
            showGpuPricing={isVisible("compute-leased")}
            showLeasedCapacity={isVisible("compute-leased")}
            showNetworkCapacity={isVisible("compute-capacity")}
          />
        </div>
      )}

      {isLoading && !hasData && (
        <div className="flex min-h-[70vh] items-center justify-center">
          <Spinner size="large" />
        </div>
      )}

      <StickyBottomNav />
    </div>
  );
};
