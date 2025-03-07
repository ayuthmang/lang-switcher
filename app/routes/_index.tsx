import type { MetaFunction } from "@remix-run/node";
import { useCallback, useDeferredValue, useState } from "react";
import { EN_TH, TH_EN } from "~/constants/key-mapping";
import { cn } from "~/utils/misc";
import { Textarea } from "~/components/ui/textarea";
import debounce from "lodash/debounce";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Pasathai" },
    {
      name: "เข้ามาเปลี่ยนภาษาด้วยเว็บนี้ได้เลย",
      content: "เปลี่ยนข้อความภาษาอังกฤษเป็นไทยง่ายแสนง่าย",
    },
  ];
};

type EditorState = {
  fromLang: "en" | "th";
  toLang: "en" | "th";
  transformer: (text: string) => string;
};

function buildKeyMapper(mapping: Record<string, string>) {
  return (text: string) => {
    return text
      .split("")
      .map((char) => mapping[char] || char)
      .join("");
  };
}

const EDITOR_STATE_MAPPER: Record<string, EditorState> = {
  en_th: { fromLang: "en", toLang: "th", transformer: buildKeyMapper(EN_TH) },
  th_en: { fromLang: "th", toLang: "en", transformer: buildKeyMapper(TH_EN) },
};

function useEditorState() {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const deferredToText = useDeferredValue(toText);
  const [editorState, setEditorState] = useState<EditorState>(
    EDITOR_STATE_MAPPER.en_th,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedToTargetLang = useCallback(
    debounce((text: string) => {
      setToText(editorState.transformer(text));
    }),
    [],
  );

  const handleFromTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = e.target;
      setFromText(value);
      debouncedToTargetLang(value);
    },
    [debouncedToTargetLang],
  );

  function swapLangState() {
    setEditorState((prev) => ({
      fromLang: prev.toLang,
      toLang: prev.fromLang,
      transformer:
        EDITOR_STATE_MAPPER[`${prev.toLang}_${prev.fromLang}`].transformer,
    }));
    const prevToText = toText;
    setFromText(prevToText);
    setToText(fromText);
  }

  return {
    fromText,
    setFromText,
    toText: deferredToText,
    handleFromTextChange,
    langState: editorState,
    swapLangState,
  };
}

export default function Index() {
  const { fromText, toText, handleFromTextChange, langState, swapLangState } =
    useEditorState();

  return (
    <main className="flex flex-1 flex-grow-[3]">
      <div className="mx-auto flex max-w-7xl flex-1 flex-col gap-4 p-8 sm:flex-col sm:gap-8">
        <div className="">
          <Button onClick={swapLangState}>Swap Lang</Button>
        </div>

        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:gap-8">
          <FormGroup>
            <label htmlFor="from">From ({langState.fromLang})</label>
            <Textarea
              className="h-full w-full flex-1"
              id="from"
              name="from"
              value={fromText}
              onChange={handleFromTextChange}
              placeholder="Type something in English that you typed in Thai&#10;e.g., l;ylfu"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="to">To ({langState.toLang})</label>
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
