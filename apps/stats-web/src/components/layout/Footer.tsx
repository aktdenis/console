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

const FOOTER_COLUMNS = [
  {
    title: "Resources",
    links: [
      { label: "Economics Paper", href: "https://akash.network/economics" },
      { label: "White Paper", href: "https://akash.network/whitepaper" },
      { label: "Blog", href: "https://akash.network/blog" },
      { label: "Brand & Press", href: "https://akash.network/brand/resources/" }
    ]
  },
  {
    title: "Network",
    links: [
      { label: "About Akash", href: "https://akash.network/about/general-information/" },
      { label: "AKT Token", href: "https://akash.network/token" },
      { label: "Compute Providers", href: "https://akash.network/ecosystem/providers/" },
      { label: "Akash Validators", href: "https://akash.network/network/akash-validators/" }
    ]
  },
  {
    title: "Community",
    links: [
      { label: "Join the Movement", href: "https://akash.network/community/welcome/" },
      { label: "Community Contributions", href: "https://akash.network/community/contributions/" },
      { label: "Events & Meetups", href: "https://akash.network/community/events" },
      { label: "Student Ambassadors", href: "https://akash.network/community/student-ambassadors/" }
    ]
  },
  {
    title: "Development",
    links: [
      { label: "Documentation", href: "https://akash.network/docs" },
      { label: "Developer Portal", href: "https://akash.network/development/welcome/" },
      { label: "Roadmap", href: "https://akash.network/roadmap/" },
      { label: "Community Groups", href: "https://akash.network/development/community-groups/" },
      { label: "Discussions", href: "https://github.com/orgs/akash-network/discussions" }
    ]
  },
  {
    title: "Product Suite",
    links: [
      { label: "Akash Console", href: "https://console.akash.network/" },
      { label: "AkashML", href: "https://akashml.com" },
      { label: "Akash Provider Console", href: "https://provider-console.akash.network/" },
      { label: "Akash Chat", href: "https://chat.akash.network/" }
    ]
  }
] as const;

const LINK_CLASSNAME = "text-sm text-muted-foreground transition-colors hover:text-foreground hover:no-underline";

export function Footer({ version }: { version: string }) {
  const theme = useCookieTheme();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t">
      <div className="container flex flex-col gap-10 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {!!theme && (
            <Link className="flex items-center" href="/">
              {theme === "light" ? <AkashConsoleLightLogo className="h-[21px] w-auto" /> : <AkashConsoleDarkLogo className="h-[21px] w-auto" />}
            </Link>
          )}

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

        <div className="grid grid-cols-2 gap-8 border-t pt-10 sm:grid-cols-3 lg:grid-cols-5">
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

        <div className="flex flex-col items-center justify-between gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© Akash Network {year}</p>
          <span>v{version}</span>
        </div>
      </div>
    </footer>
  );
}
