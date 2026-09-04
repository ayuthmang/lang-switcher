import type { MetaFunction } from "react-router";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { enToTh, thToEn } from "~/utils/key-mapper";
import { detectScript } from "~/utils/detect-script";
import { useIsMac, useShortcuts } from "~/utils/use-shortcut";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Kbd } from "~/components/ui/kbd";
import { ArrowRightLeft, Check, Copy, ListRestart } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Pasathai" },
    {
      name: "เข้ามาเปลี่ยนภาษาด้วยเว็บนี้ได้เลย",
      content: "เปลี่ยนข้อความภาษาอังกฤษเป็นไทยง่ายแสนง่าย",
    },
  ];
};

const DIRECTIONS = {
  en_th: {
    from: { code: "en", name: "English", script: "latin" },
    to: { code: "th", name: "ไทย", script: "thai" },
    transform: enToTh,
    reversed: "th_en",
    placeholder: "l;ylfu",
  },
  th_en: {
    from: { code: "th", name: "ไทย", script: "thai" },
    to: { code: "en", name: "English", script: "latin" },
    transform: thToEn,
    reversed: "en_th",
    placeholder: "สวัสดี",
  },
} as const;

type Direction = keyof typeof DIRECTIONS;

function useEditorState() {
  const [fromText, setFromText] = useState("");
  const [direction, setDirection] = useState<Direction>("en_th");
  const { from, to, transform, reversed, placeholder } = DIRECTIONS[direction];

  // The output is derived, never stored, so it cannot drift out of sync with
  // the input or the active direction. Deferring the input keeps typing
  // responsive while a large conversion renders.
  const deferredFromText = useDeferredValue(fromText);
  const toText = useMemo(
    () => transform(deferredFromText),
    [transform, deferredFromText],
  );

  // Nudge rather than auto-switch: silently changing direction under someone
  // mid-paste is more surprising than a hint they can ignore. Only an input
  // that is clearly the *destination* script counts — empty and mixed input
  // stays quiet.
  const looksReversed = detectScript(fromText) === to.script;

  const handleFromTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setFromText(e.target.value),
    [],
  );

  const swap = useCallback(() => {
    // Promote the current output to the input; the new output derives itself.
    setFromText((current) => transform(current));
    setDirection(reversed);
  }, [transform, reversed]);

  const clear = useCallback(() => setFromText(""), []);

  return {
    fromText,
    toText,
    from,
    to,
    placeholder,
    looksReversed,
    handleFromTextChange,
    swap,
    clear,
  };
}

/** Copies text, falling back to selecting it when the clipboard is unavailable. */
function useCopy(
  getText: () => string,
  fallbackRef: React.RefObject<HTMLTextAreaElement>,
) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = useCallback(async () => {
    const text = getText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      fallbackRef.current?.select();
    }
  }, [getText, fallbackRef]);

  return { copied, copy };
}

export default function Index() {
  const {
    fromText,
    toText,
    from,
    to,
    placeholder,
    looksReversed,
    handleFromTextChange,
    swap,
    clear,
  } = useEditorState();

  const fromRef = useRef<HTMLTextAreaElement>(null);
  const toRef = useRef<HTMLTextAreaElement>(null);
  const isMac = useIsMac();
  const mod = isMac ? "⌘" : "Ctrl";

  const { copied, copy } = useCopy(() => toText, toRef);

  // Land ready to paste.
  useEffect(() => void fromRef.current?.focus(), []);

  const focusInput = useCallback(() => {
    fromRef.current?.focus();
    fromRef.current?.select();
  }, []);

  useShortcuts([
    { key: "Enter", mod: true, run: copy },
    { key: "s", mod: true, shift: true, run: swap },
    {
      key: "k",
      mod: true,
      shift: true,
      run: () => {
        clear();
        focusInput();
      },
    },
    { key: "/", whileTyping: false, run: focusInput },
  ]);

  return (
    <main className="flex flex-1 flex-grow-[3]">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-6 sm:px-8">
        <div className="flex flex-1 flex-col items-stretch gap-3 md:flex-row md:gap-4">
          <Pane
            id="from"
            label="You typed"
            language={from.name}
            action={
              <ShortcutButton
                onClick={() => {
                  clear();
                  focusInput();
                }}
                disabled={!fromText}
                icon={<ListRestart className="h-4 w-4" />}
                keys={[mod, "⇧", "K"]}
              >
                Clear
              </ShortcutButton>
            }
          >
            <Textarea
              ref={fromRef}
              id="from"
              name="from"
              value={fromText}
              onChange={handleFromTextChange}
              spellCheck={false}
              autoComplete="off"
              placeholder={`Paste or type here — e.g. ${placeholder}`}
              className="h-full min-h-48 flex-1 resize-none text-lg leading-relaxed"
            />
          </Pane>

          <div className="flex items-center justify-center md:pt-9">
            <Button
              variant="outline"
              size="icon"
              onClick={swap}
              title={`Swap languages (${mod}⇧S)`}
              aria-label="Swap languages"
              aria-keyshortcuts={isMac ? "Meta+Shift+S" : "Control+Shift+S"}
              className="rounded-full shadow-sm"
            >
              <ArrowRightLeft className="h-4 w-4 md:rotate-0" />
            </Button>
          </div>

          <Pane
            id="to"
            label="You meant"
            language={to.name}
            action={
              <ShortcutButton
                onClick={copy}
                disabled={!toText}
                icon={
                  copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )
                }
                keys={[mod, "↵"]}
              >
                {copied ? "Copied" : "Copy"}
              </ShortcutButton>
            }
          >
            <Textarea
              ref={toRef}
              id="to"
              name="to"
              value={toText}
              readOnly
              placeholder="The fixed text appears here"
              className="h-full min-h-48 flex-1 resize-none bg-muted/40 text-lg leading-relaxed"
            />
          </Pane>
        </div>

        <div
          role="status"
          className="min-h-5 text-center text-sm text-muted-foreground"
        >
          {looksReversed ? (
            <span>
              That looks like {to.name}. Press{" "}
              <Kbd keys={[mod, "⇧", "S"]} className="mx-0.5 align-middle" /> to
              swap.
            </span>
          ) : null}
        </div>

        <ShortcutLegend mod={mod} />
      </div>
    </main>
  );
}

function Pane({
  id,
  label,
  language,
  action,
  children,
}: {
  id: string;
  label: string;
  language: string;
  action: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex h-8 items-center justify-between gap-2">
        <label htmlFor={id} className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
            {language}
          </span>
        </label>
        {action}
      </div>
      {children}
    </div>
  );
}

function ShortcutButton({
  onClick,
  disabled,
  icon,
  keys,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  keys: string[];
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="h-8 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
    >
      {icon}
      {children}
      <Kbd keys={keys} className="ml-1 hidden sm:inline-flex" />
    </Button>
  );
}

function ShortcutLegend({ mod }: { mod: string }) {
  const shortcuts = [
    { keys: [mod, "↵"], label: "Copy" },
    { keys: [mod, "⇧", "S"], label: "Swap" },
    { keys: [mod, "⇧", "K"], label: "Clear" },
    { keys: ["/"], label: "Focus" },
  ];

  return (
    // Hidden on touch-sized screens, where the shortcuts cannot be pressed.
    <ul className="hidden flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground sm:flex">
      {shortcuts.map(({ keys, label }) => (
        <li key={label} className="flex items-center gap-1.5">
          <Kbd keys={keys} />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
