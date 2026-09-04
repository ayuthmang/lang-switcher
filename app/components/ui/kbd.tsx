import { cn } from "~/utils/misc";

/** Renders a keyboard shortcut as a row of key caps. */
export function Kbd({
  keys,
  className,
}: {
  keys: string[];
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {keys.map((key) => (
        <kbd
          key={key}
          className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1 font-sans text-[0.6875rem] font-medium text-muted-foreground"
        >
          {key}
        </kbd>
      ))}
    </span>
  );
}
