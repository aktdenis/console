"use client";
import React from "react";
import { FormattedNumber } from "react-intl";
import AutoScroll from "embla-carousel-auto-scroll";

import { CarouselStatCard } from "./CarouselStatCard";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { percIncrease, udenomToDenom } from "@/lib/mathHelpers";
import { useGraphSnapshot } from "@/queries";
import type { DashboardData } from "@/types";
import { Snapshots } from "@/types";

const TREND_WINDOW_DAYS = 7;

function useRecentTrend(snapshot: Snapshots, toDisplayValue: (raw: number) => number) {
  const { data } = useGraphSnapshot(snapshot);
  const completed = data?.snapshots?.slice(0, -1);
  return completed && completed.length > 0 ? completed.slice(-TREND_WINDOW_DAYS).map(point => toDisplayValue(point.value)) : undefined;
}

const identity = (value: number) => value;

interface IOverviewStatsCarouselProps {
  dashboardData: DashboardData;
}

type CarouselStatItem = {
  key: string;
  text: string;
  number: React.ReactNode;
  diffPercent: number;
  trend?: number[];
};

export const OverviewStatsCarousel: React.FunctionComponent<IOverviewStatsCarouselProps> = ({ dashboardData }) => {
  const { now, compare } = dashboardData;

  const dailyUsdSpentTrend = useRecentTrend(Snapshots.dailyUUsdSpent, udenomToDenom);
  const totalUsdSpentTrend = useRecentTrend(Snapshots.totalUUsdSpent, udenomToDenom);
  const dailyLeaseCountTrend = useRecentTrend(Snapshots.dailyLeaseCount, identity);
  const totalLeaseCountTrend = useRecentTrend(Snapshots.totalLeaseCount, identity);
  const activeLeaseCountTrend = useRecentTrend(Snapshots.activeLeaseCount, identity);
  const activeGPUTrend = useRecentTrend(Snapshots.activeGPU, identity);

  if (!now || !compare) return null;

  const items: (CarouselStatItem | false)[] = [
    now.dailyUUsdSpent !== undefined &&
      compare.dailyUUsdSpent !== undefined && {
        key: "usd-spent-24h",
        text: "USD spent (24h)",
        number: (
          <FormattedNumber
            value={udenomToDenom(now.dailyUUsdSpent)}
            maximumFractionDigits={2}
            style="currency"
            currencyDisplay="narrowSymbol"
            notation="compact"
            compactDisplay="short"
            currency="USD"
          />
        ),
        diffPercent: percIncrease(compare.dailyUUsdSpent, now.dailyUUsdSpent),
        trend: dailyUsdSpentTrend
      },
    now.totalUUsdSpent !== undefined &&
      compare.totalUUsdSpent !== undefined && {
        key: "total-spent-usd",
        text: "Total spent USD",
        number: (
          <FormattedNumber
            value={udenomToDenom(now.totalUUsdSpent)}
            maximumFractionDigits={2}
            style="currency"
            currencyDisplay="narrowSymbol"
            notation="compact"
            compactDisplay="short"
            currency="USD"
          />
        ),
        diffPercent: percIncrease(compare.totalUUsdSpent, now.totalUUsdSpent),
        trend: totalUsdSpentTrend
      },
    now.dailyLeaseCount !== undefined &&
      compare.dailyLeaseCount !== undefined && {
        key: "new-leases-24h",
        text: "New leases (24h)",
        number: <FormattedNumber value={now.totalLeaseCount - compare.totalLeaseCount} notation="compact" compactDisplay="short" />,
        diffPercent: percIncrease(compare.dailyLeaseCount, now.dailyLeaseCount),
        trend: dailyLeaseCountTrend
      },
    now.totalLeaseCount !== undefined &&
      compare.totalLeaseCount !== undefined && {
        key: "total-leases",
        text: "Total leases",
        number: <FormattedNumber value={now.totalLeaseCount} notation="compact" compactDisplay="short" />,
        diffPercent: percIncrease(compare.totalLeaseCount, now.totalLeaseCount),
        trend: totalLeaseCountTrend
      },
    now.activeLeaseCount !== undefined &&
      compare.activeLeaseCount !== undefined && {
        key: "active-leases",
        text: "Active leases",
        number: <FormattedNumber value={now.activeLeaseCount} notation="compact" compactDisplay="short" maximumFractionDigits={2} />,
        diffPercent: percIncrease(compare.activeLeaseCount, now.activeLeaseCount),
        trend: activeLeaseCountTrend
      },
    now.activeGPU !== undefined &&
      compare.activeGPU !== undefined && {
        key: "active-gpus",
        text: "Active GPUs",
        number: <FormattedNumber value={now.activeGPU} notation="compact" compactDisplay="short" maximumFractionDigits={2} />,
        diffPercent: percIncrease(compare.activeGPU, now.activeGPU),
        trend: activeGPUTrend
      }
  ];

  const visibleItems = items.filter((item): item is CarouselStatItem => !!item);

  if (!visibleItems.length) return null;

  return (
    <Carousel opts={{ align: "start", loop: true }} plugins={[AutoScroll({ speed: 1, stopOnInteraction: false })]} className="w-full">
      <CarouselContent>
        {visibleItems.map(item => (
          <CarouselItem key={item.key} className="basis-1/2 sm:basis-1/3 lg:basis-1/4">
            <CarouselStatCard number={item.number} text={item.text} diffPercent={item.diffPercent} trend={item.trend} periodLabel="this 7D" />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
