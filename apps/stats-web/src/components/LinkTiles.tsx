import type { FC } from "react";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@akashnetwork/ui/components";
import { ArrowRight, MediaImage } from "iconoir-react";
import Link from "next/link";

export type LinkTileItem = {
  key: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
};

export type LinkTilesProps = {
  items: readonly LinkTileItem[];
};

export const LinkTiles: FC<LinkTilesProps> = ({ items }) => (
  <div className="grid gap-6 sm:grid-cols-2">
    {items.map(item => (
      <Card key={item.key} className="flex flex-col overflow-hidden">
        <div className="flex aspect-[3/2] items-center justify-center bg-muted">
          <MediaImage className="size-8 text-muted-foreground/50" />
        </div>
        <CardHeader>
          <CardDescription>{item.eyebrow}</CardDescription>
          <CardTitle>{item.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <CardDescription>{item.body}</CardDescription>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" size="sm" className="hover:no-underline">
            <Link href={item.href} target="_blank" rel="noreferrer">
              {item.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    ))}
  </div>
);
