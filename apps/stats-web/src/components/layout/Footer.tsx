"use client";
import { Discord, Github, Instagram, Linkedin, Telegram, X as TwitterX, Youtube } from "iconoir-react";
import Link from "next/link";

import { AkashConsoleDarkLogo, AkashConsoleLightLogo } from "../icons/AkashConsoleLogo";

import useCookieTheme from "@/hooks/useTheme";

const SOCIAL_LINKS = [
  { label: "Twitter", href: "https://x.com/akashnet", Icon: TwitterX },
  { label: "GitHub", href: "https://github.com/akash-network", Icon: Github },
  { label: "Discord", href: "https://discord.com/invite/akash", Icon: Discord },
  { label: "YouTube", href: "https://www.youtube.com/c/AkashNetwork", Icon: Youtube },
  { label: "Telegram", href: "https://t.me/AkashNW", Icon: Telegram },
  { label: "Instagram", href: "https://www.instagram.com/akash.network/?hl=en", Icon: Instagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/akash-network/", Icon: Linkedin }
] as const;

const FOOTER_SUBLINE =
  "Akash is an open compute marketplace that gives builders access to a competitive global supply of infrastructure, without being locked into a single cloud provider.";

const FOOTER_COLUMNS = [
  {
    title: "Development",
    links: [
      { label: "Documentation", href: "https://akash.network/docs" },
      { label: "Developer Portal", href: "https://akash.network/development/welcome/" },
      { label: "Roadmap", href: "https://akash.network/roadmap/" }
    ]
  },
  {
    title: "Product Suite",
    links: [
      { label: "Akash Console", href: "https://console.akash.network/" },
      { label: "AkashML", href: "https://akashml.com" },
      { label: "Akash Provider Console", href: "https://provider-console.akash.network/" },
      { label: "Akash Homenode", href: "http://homenode.akash.network/" }
    ]
  },
  {
    title: "Ecosystem",
    links: [
      { label: "Powered by Akash", href: "https://akash.network/ecosystem/deployed-on-akash/showcase/" },
      { label: "Case Studies", href: "https://akash.network/case-studies/" }
    ]
  },
  {
    title: "About",
    links: [
      { label: "Compare", href: "https://akash.network/explore/compare" },
      { label: "Use Cases", href: "https://akash.network/explore/use-cases/" },
      { label: "Architectural Overview", href: "https://akash.network/architectural-overview/" }
    ]
  }
] as const;

const LINK_CLASSNAME = "text-sm text-muted-foreground transition-colors hover:text-foreground hover:no-underline";

export function Footer({ version }: { version: string }) {
  const theme = useCookieTheme();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t">
      <div className="container flex flex-col gap-10 py-10 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between">
        {!!theme && (
          <div className="flex flex-col gap-4 lg:max-w-xs">
            <Link className="flex items-center" href="/">
              {theme === "light" ? <AkashConsoleLightLogo className="h-[21px] w-auto" /> : <AkashConsoleDarkLogo className="h-[21px] w-auto" />}
            </Link>
            <p className="text-sm text-muted-foreground">{FOOTER_SUBLINE}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:gap-x-16">
          {FOOTER_COLUMNS.map(column => (
            <div key={column.title} className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-foreground">{column.title}</span>
              {column.links.map(link => (
                <Link key={link.label} href={link.href} target="_blank" rel="noreferrer" className={LINK_CLASSNAME}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Akash Network ${label}`}
              className="text-muted-foreground transition-colors hover:text-foreground hover:no-underline"
            >
              <Icon className="size-5" />
            </Link>
          ))}
        </div>
      </div>

      <div className="container flex flex-col items-center justify-between gap-2 border-t py-6 text-xs text-muted-foreground sm:flex-row">
        <p>© Akash Network {year}</p>
        <span>v{version}</span>
      </div>
    </footer>
  );
}
