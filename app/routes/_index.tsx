import debounce from "lodash/debounce";
import type { MetaFunction } from "@remix-run/node";
import { useCallback, useState } from "react";
import { EN_TH } from "~/constants/key-mapping";
import { cn } from "~/utils/misc";
import { Textarea } from "~/components/ui/textarea";

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

function getEditorInitialState() {
  return { from: "l;ylfu", to: toThai("l;ylfu") };
}

export default function Index() {
  const [editorState, setEditorState] = useState(() => getEditorInitialState());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleTransformToTargetLang = useCallback(
    debounce(() => {
      setEditorState((prevState) => ({
        ...prevState,
        to: toThai(prevState.from),
      }));
    }, 300),
    [],
  );

  const handleEditorChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const nextState = { [name]: value };

      if (name === "from") {
        handleTransformToTargetLang();
      }

      setEditorState((prevState) => ({
        ...prevState,
        ...nextState,
      }));
    },
    [handleTransformToTargetLang],
  );

  return (
    <main className="flex flex-1 flex-grow-[3]">
      <div className="mx-auto flex max-w-7xl flex-1 flex-col gap-4 p-8 sm:flex-row sm:gap-8">
        <FormGroup>
          <label htmlFor="from">From</label>
          <Textarea
            className="h-full w-full flex-1"
            id="from"
            name="from"
            value={editorState.from}
            onChange={handleEditorChange}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="to">To</label>
          <Textarea
            className="h-full w-full flex-1"
            id="to"
            name="to"
            value={editorState.to}
            readOnly
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
