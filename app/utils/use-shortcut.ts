import { useEffect, useRef, useState } from "react";

export type Shortcut = {
  /** `event.key`, compared case-insensitively. */
  key: string;
  /** Requires the platform's primary modifier: Cmd on macOS, Ctrl elsewhere. */
  mod?: boolean;
  shift?: boolean;
  /** Fire even while a text field has focus. Defaults to true for `mod` combos. */
  whileTyping?: boolean;
  run: () => void;
};

function isTextField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA"
  );
}

/** True on macOS, where the primary modifier is Cmd rather than Ctrl. */
export function useIsMac(): boolean {
  // Resolved after mount so the server and client render the same markup.
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(/mac/i.test(navigator.platform || navigator.userAgent));
  }, []);
  return isMac;
}

export function useShortcuts(shortcuts: Shortcut[]) {
  const ref = useRef(shortcuts);
  ref.current = shortcuts;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      for (const s of ref.current) {
        if (event.key.toLowerCase() !== s.key.toLowerCase()) continue;

        const mod = event.metaKey || event.ctrlKey;
        if (Boolean(s.mod) !== mod) continue;
        if (Boolean(s.shift) !== event.shiftKey) continue;

        const whileTyping = s.whileTyping ?? Boolean(s.mod);
        if (!whileTyping && isTextField(event.target)) continue;

        event.preventDefault();
        s.run();
        return;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
