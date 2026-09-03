import type { MetaFunction } from "react-router";
import {
  useCallback,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
} from "react";
import { enToTh, thToEn } from "~/utils/key-mapper";
import { cn } from "~/utils/misc";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { ArrowRightLeft, ListRestart } from "lucide-react";

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
  en_th: { fromLang: "en", toLang: "th", transform: enToTh, reversed: "th_en" },
  th_en: { fromLang: "th", toLang: "en", transform: thToEn, reversed: "en_th" },
} as const;

type Direction = keyof typeof DIRECTIONS;

function useEditorState() {
  const [fromText, setFromText] = useState("");
  const [direction, setDirection] = useState<Direction>("en_th");
  const { fromLang, toLang, transform, reversed } = DIRECTIONS[direction];

  // The output is derived, never stored, so it cannot drift out of sync with
  // the input or the active direction. Deferring the input keeps typing
  // responsive while a large conversion renders.
  const deferredFromText = useDeferredValue(fromText);
  const toText = useMemo(
    () => transform(deferredFromText),
    [transform, deferredFromText],
  );

  const handleFromTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFromText(e.target.value);
    },
    [],
  );

  function swapLangState() {
    // Promote the current output to the input; the new output derives itself.
    setFromText(transform(fromText));
    setDirection(reversed);
  }

  function clearAllText() {
    setFromText("");
  }

  return {
    fromText,
    toText,
    handleFromTextChange,
    fromLang,
    toLang,
    swapLangState,
    clearAllText,
  };
}

export default function Index() {
  const {
    fromText,
    toText,
    handleFromTextChange,
    fromLang,
    toLang,
    swapLangState,
    clearAllText,
  } = useEditorState();
  const fromTextRef = useRef<HTMLTextAreaElement>(null);

  return (
    <main className="flex flex-1 flex-grow-[3]">
      <div className="mx-auto flex max-w-7xl flex-1 flex-col gap-4 p-8 sm:flex-col sm:gap-8">
        <div className="flex flex-row gap-4">
          <Button onClick={swapLangState}>
            <ArrowRightLeft className="ml-2 h-4 w-4" />
            Swap Lang
          </Button>
          <Button
            onClick={() => {
              clearAllText();
              fromTextRef.current?.focus();
            }}
          >
            <ListRestart className="ml-2 h-4 w-4" />
            Clear
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:gap-8">
          <FormGroup>
            <label htmlFor="from">From ({fromLang})</label>
            <Textarea
              className="h-full w-full flex-1"
              ref={fromTextRef}
              id="from"
              name="from"
              value={fromText}
              onChange={handleFromTextChange}
              placeholder="Type something in English that you typed in Thai&#10;e.g., l;ylfu"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="to">To ({toLang})</label>
            <Textarea
              className="h-full w-full flex-1"
              id="to"
              name="to"
              value={toText}
              readOnly
              placeholder="See the magic happens here&#10;e.g., สวัสดี"
            />
          </FormGroup>
        </div>
      </div>
    </main>
  );
}

function FormGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-1 flex-col gap-2", className)}>
      {children}
    </div>
  );
}
