import type { MetaFunction } from "@remix-run/node";
import { useCallback, useDeferredValue, useState } from "react";
import { EN_TH } from "~/constants/key-mapping";
import { cn } from "~/utils/misc";
import { Textarea } from "~/components/ui/textarea";
import debounce from "lodash/debounce";

export const meta: MetaFunction = () => {
  return [
    { title: "Pasathai" },
    {
      name: "เข้ามาเปลี่ยนภาษาด้วยเว็บนี้ได้เลย",
      content: "เปลี่ยนข้อความภาษาอังกฤษเป็นไทยง่ายแสนง่าย",
    },
  ];
};

function buildKeyMapper(mapping: Record<string, string>) {
  return (text: string) => {
    return text
      .split("")
      .map((char) => mapping[char] || char)
      .join("");
  };
}

const toThai = buildKeyMapper(EN_TH);

function useEditorState() {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const deferredToText = useDeferredValue(toText);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedToThai = useCallback(
    debounce((text: string) => {
      const toText = toThai(text);
      setToText(toText);
    }),
    [],
  );

  const handleFromTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = e.target;
      setFromText(value);
      debouncedToThai(value);
    },
    [debouncedToThai],
  );

  return {
    fromText,
    setFromText,
    toText: deferredToText,
    handleFromTextChange,
  };
}

export default function Index() {
  const { fromText, toText, handleFromTextChange } = useEditorState();

  return (
    <main className="flex flex-1 flex-grow-[3]">
      <div className="mx-auto flex max-w-7xl flex-1 flex-col gap-4 p-8 sm:flex-row sm:gap-8">
        <FormGroup>
          <label htmlFor="from">From</label>
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
          <label htmlFor="to">To</label>
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
