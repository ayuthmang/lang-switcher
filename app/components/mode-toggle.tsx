import { Check, Monitor, Moon, Sun } from "lucide-react";
import { Theme, useTheme } from "remix-themes";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useCallback, useEffect, useState } from "react";

export function ModeToggle() {
  const [theme, setTheme] = useTheme();
  const [useSystemTheme, setUseSystemTheme] = useState(true);

  const matchSystemTheme = useCallback(
    function matchSystemTheme() {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(systemPrefersDark ? Theme.DARK : Theme.LIGHT);
    },
    [setTheme],
  );

  function handleThemeChange(
    theme: (typeof Theme)[keyof typeof Theme] | "system",
  ) {
    if (theme === "system") {
      setUseSystemTheme(true);
      matchSystemTheme();
    } else {
      setUseSystemTheme(false);
      setTheme(theme);
    }
  }

  useEffect(() => {
    function handleChange() {
      matchSystemTheme();
    }

    if (useSystemTheme) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, useSystemTheme, matchSystemTheme]);

  useEffect(() => {
    handleThemeChange("system");
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {useSystemTheme && (
            <Monitor className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          )}
          {theme === Theme.LIGHT && !useSystemTheme && (
            <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          )}
          {theme === Theme.DARK && !useSystemTheme && (
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            handleThemeChange("system");
          }}
        >
          <Monitor className="mr-2 h-4 w-4" />
          System
          {useSystemTheme && <Check className="ml-2 h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            handleThemeChange(Theme.LIGHT);
          }}
        >
          <Sun className="mr-2 h-4 w-4" />
          Light
          {theme === Theme.LIGHT && !useSystemTheme && (
            <Check className="ml-2 h-4 w-4" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            handleThemeChange(Theme.DARK);
          }}
        >
          <Moon className="mr-2 h-4 w-4" />
          Dark
          {theme === Theme.DARK && !useSystemTheme && (
            <Check className="ml-2 h-4 w-4" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
