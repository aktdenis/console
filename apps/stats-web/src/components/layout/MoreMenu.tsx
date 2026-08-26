"use client";
import { useEffect, useState } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@akashnetwork/ui/components";
import { ArrowUpRightSquare, Discord, Github, X as TwitterX } from "iconoir-react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

import { networkStore } from "@/store/network.store";

export const MoreMenu = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [{ isLoading: isLoadingNetworks, data: networks }] = networkStore.useNetworksStore();
  const [selectedNetworkId, setSelectedNetworkId] = networkStore.useSelectedNetworkIdStore({ reloadOnChange: true });

  useEffect(() => {
    setMounted(true);
  }, []);

  function onThemeChange(nextTheme: string) {
    setTheme(nextTheme);
    document.cookie = `theme=${nextTheme}; path=/`;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="size-4" />
          <span className="sr-only">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Network</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={selectedNetworkId} onValueChange={setSelectedNetworkId}>
          {networks.map(network => (
            <DropdownMenuRadioItem key={network.id} disabled={!network.enabled || isLoadingNetworks} value={network.id}>
              {network.title} <span className="text-xs text-muted-foreground">- {network.version}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link className="flex items-center gap-2" target="_blank" rel="noreferrer" href="https://twitter.com/akashnet">
            <TwitterX className="size-4" />
            Twitter
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="flex items-center gap-2" target="_blank" rel="noreferrer" href="https://github.com/akash-network/console">
            <Github className="size-4" />
            GitHub
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link className="flex items-center gap-2" target="_blank" rel="noreferrer" href="https://discord.akash.network">
            <Discord className="size-4" />
            Discord
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link className="flex items-center gap-2" target="_blank" rel="noreferrer" href="https://akash.network">
            <ArrowUpRightSquare className="size-4" />
            akash.network
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        {mounted && (
          <DropdownMenuRadioGroup value={theme} onValueChange={onThemeChange}>
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
