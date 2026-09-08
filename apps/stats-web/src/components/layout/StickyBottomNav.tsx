"use client";
import { type FC, useEffect, useRef } from "react";
import { CustomNoDivTooltip } from "@akashnetwork/ui/components";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AkashSignIcon } from "@/components/icons/AkashSignIcon";
import { cn } from "@/lib/utils";

/** The floating nav bar's permanent gap from the viewport bottom. */
const NAV_BAR_BOTTOM_GAP_PX = 30;

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/assets-spent", label: "Assets Spent" },
  { href: "/compute-capacity", label: "Compute Capacity" },
  { href: "/compute-leased", label: "Compute Leased" },
  { href: "/bme", label: "BME" },
  { href: "/blockchain", label: "Blockchain" },
  { href: "/network-report", label: "Report Mode" }
] as const;

const NAV_ITEM_CLASSNAME =
  "shrink-0 whitespace-nowrap rounded-lg border border-[rgb(78,78,78)] px-3 py-1.5 text-[13px] text-[rgb(222,222,222)] transition-colors hover:bg-white/10 hover:text-white hover:no-underline dark:border-[rgb(190,190,190)] dark:text-[rgb(34,34,34)] dark:hover:bg-black/10 dark:hover:text-black";
const NAV_ITEM_ACTIVE_CLASSNAME = "border-white text-white dark:border-black dark:text-black";

export const DEPENDENCIES = { usePathname };

export type StickyBottomNavProps = { dependencies?: typeof DEPENDENCIES };

export const StickyBottomNav: FC<StickyBottomNavProps> = ({ dependencies: d = DEPENDENCIES }) => {
  const pathname = d.usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const footer = document.querySelector("footer");
    if (!nav || !footer) return;

    const previousFooterPaddingBottom = footer.style.paddingBottom;

    function reserveFooterSpace() {
      if (!nav || !footer) return;
      footer.style.paddingBottom = `${nav.getBoundingClientRect().height + NAV_BAR_BOTTOM_GAP_PX}px`;
    }

    reserveFooterSpace();
    const resizeObserver = new ResizeObserver(reserveFooterSpace);
    resizeObserver.observe(nav);

    return () => {
      resizeObserver.disconnect();
      footer.style.paddingBottom = previousFooterPaddingBottom;
    };
  }, []);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-36 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      <nav
        ref={navRef}
        aria-label="Sections"
        className="fixed left-1/2 z-50 flex w-fit max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 overflow-x-auto rounded-xl bg-[rgba(34,34,34,0.85)] p-3 shadow-lg backdrop-blur dark:bg-[rgba(222,222,222,0.9)]"
        style={{ bottom: NAV_BAR_BOTTOM_GAP_PX }}
      >
        <CustomNoDivTooltip title="Go to akash.network" className="max-w-none p-2">
          <a
            href="https://akash.network"
            target="_blank"
            rel="noreferrer"
            aria-label="Go to akash.network"
            className={cn(
              NAV_ITEM_CLASSNAME,
              "flex items-center justify-center bg-white text-black hover:scale-105 hover:bg-white hover:text-black dark:bg-black dark:text-white dark:hover:bg-black dark:hover:text-white"
            )}
          >
            <AkashSignIcon className="size-4" />
          </a>
        </CustomNoDivTooltip>

        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(NAV_ITEM_CLASSNAME, isActive && NAV_ITEM_ACTIVE_CLASSNAME)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
};
