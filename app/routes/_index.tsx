import debounce from "lodash/debounce";
import type { MetaFunction } from "@remix-run/node";
import { useCallback, useState } from "react";
import { EN_TH } from "~/constants/key-mapping";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
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

const editorInitialState = {
  from: "l;ylfu",
  to: toThai("l;ylfu"),
};

export default function Index() {
  const [editorState, setEditorState] = useState(() => {
    return editorInitialState;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleTransformToTargetLang = useCallback(
    debounce(() => {
      setEditorState((prevState) => ({
        ...prevState,
        to: toThai(prevState.from),
      }));
    }, 300),
    []
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
    [handleTransformToTargetLang]
  );

  return (
    <div className="h-screen flex justify-center">
      <div className="grid grid-cols-2 gap-4 w-full">
        <TextArea
          name="from"
          value={editorState.from}
          onChange={handleEditorChange}
        />
        <TextArea name="to" value={editorState.to} />
      </div>
    </div>
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="w-full h-full" {...props} />;
}
