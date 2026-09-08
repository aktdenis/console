"use client";
import { Button } from "@akashnetwork/ui/components";
import Link from "next/link";

import { AkashConsoleDarkLogo, AkashConsoleLightLogo } from "../icons/AkashConsoleLogo";
import { GettingStartedMenu } from "./GettingStartedMenu";
import { TopBanner } from "./TopBanner";

import useCookieTheme from "@/hooks/useTheme";
import { useTopBanner } from "@/hooks/useTopBanner";

export const Nav = () => {
  const theme = useCookieTheme();
  const { hasBanner } = useTopBanner();

  return (
    <header className="w-full bg-transparent">
      {hasBanner && (
        <div>
          <TopBanner />
        </div>
      )}

      <div className="container flex h-14 items-center">
        {!!theme && (
          <Link className="flex items-center space-x-2" href="/" onClick={() => window.scrollTo({ top: 0 })}>
            {theme === "light" ? <AkashConsoleLightLogo className="h-[21px] w-auto" /> : <AkashConsoleDarkLogo className="h-[21px] w-auto" />}
          </Link>
        )}

        <div className="flex flex-1 items-center justify-end gap-2">
          <Link rel="noreferrer" href="https://console.akash.network" passHref target="_blank" className="hidden md:block">
            <Button variant="default" size="sm" className="h-[30px] hover:no-underline">
              Deploy Now
            </Button>
          </Link>

          <GettingStartedMenu />
        </div>
      </div>
    </header>
  );
};
