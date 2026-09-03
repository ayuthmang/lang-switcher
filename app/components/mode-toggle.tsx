import { Check, Monitor, Moon, Sun } from "lucide-react";
import { Theme, useTheme } from "remix-themes";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

/** `null` means "follow the OS preference". */
const OPTIONS = [
  { value: null, label: "System", icon: Monitor },
  { value: Theme.LIGHT, label: "Light", icon: Sun },
  { value: Theme.DARK, label: "Dark", icon: Moon },
] as const;

export function ModeToggle() {
  const [theme, setTheme, metadata] = useTheme();

  // remix-themes persists the user/system distinction in the theme cookie and
  // owns the prefers-color-scheme subscription, so there is nothing to mirror
  // in local state here.
  const selected = metadata.definedBy === "SYSTEM" ? null : theme;
  const ActiveIcon =
    OPTIONS.find((option) => option.value === selected)?.icon ?? Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <ActiveIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPTIONS.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem key={label} onClick={() => setTheme(value)}>
            <Icon className="mr-2 h-4 w-4" />
            {label}
            {selected === value && <Check className="ml-2 h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
