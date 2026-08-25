"use client";
import { Button } from "@akashnetwork/ui/components";
import Link from "next/link";

import { AkashConsoleDarkLogo, AkashConsoleLightLogo } from "../icons/AkashConsoleLogo";
import { MobileNav } from "./MobileNav";
import { MoreMenu } from "./MoreMenu";

const NetworkSelect = dynamic(() => import("./NetworkSelect"), {
  ssr: false
});

import dynamic from "next/dynamic";

import { TopBanner } from "./TopBanner";

import useCookieTheme from "@/hooks/useTheme";
import { useTopBanner } from "@/hooks/useTopBanner";

export const Nav = () => {
  const theme = useCookieTheme();
  const { hasBanner } = useTopBanner();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-header backdrop-blur supports-[backdrop-filter]:bg-header">
      {hasBanner && (
        <div>
          <TopBanner />
        </div>
      )}

      <div className="container flex h-14 items-center">
        {!!theme && (
          <Link className="flex items-center space-x-2" href="/">
            {theme === "light" ? <AkashConsoleLightLogo className="h-[25px] max-w-[180px]" /> : <AkashConsoleDarkLogo className="h-[25px] max-w-[180px]" />}
          </Link>
        )}

        <div className="flex flex-1 items-center justify-end">
          <div className="md:hidden">
            <MobileNav />
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            <Link href="/bme">
              <Button variant="ghost" size="sm">
                BME
              </Button>
            </Link>

            <NetworkSelect />

            <Link rel="noreferrer" href="https://console.akash.network" passHref target="_blank">
              <Button variant="default" size="sm" className="h-[30px]">
                Deploy Now
              </Button>
            </Link>

            <MoreMenu />
          </nav>
        </div>
      </div>
    </header>
  );
};
