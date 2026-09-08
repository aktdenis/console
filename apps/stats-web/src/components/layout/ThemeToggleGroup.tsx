"use client";
import { type FC, useEffect, useState } from "react";
import { Button } from "@akashnetwork/ui/components";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { key: "light", label: "Light", Icon: Sun },
  { key: "dark", label: "Dark", Icon: Moon },
  { key: "system", label: "System", Icon: Monitor }
] as const;

export const DEPENDENCIES = { useTheme };

export type ThemeToggleGroupProps = {
  dependencies?: typeof DEPENDENCIES;
};

export const ThemeToggleGroup: FC<ThemeToggleGroupProps> = ({ dependencies: d = DEPENDENCIES }) => {
  const { theme, setTheme } = d.useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function selectTheme(next: string) {
    setTheme(next);
    document.cookie = `theme=${next}; path=/`;
  }

  return (
    <div className="flex items-center gap-0.5 rounded-full border p-0.5">
      {THEME_OPTIONS.map(option => {
        const isActive = mounted && theme === option.key;
        return (
          <Button
            key={option.key}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={option.label}
            aria-pressed={isActive}
            onClick={() => selectTheme(option.key)}
            className={cn("h-6 w-6 rounded-full text-muted-foreground", isActive && "bg-muted text-foreground")}
          >
            <option.Icon className="size-3.5" />
          </Button>
        );
      })}
    </div>
  );
};
