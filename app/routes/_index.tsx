import type { MetaFunction } from "@remix-run/node";
import { useCallback, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const KEY_MAPPING_ENG_TH = {
  "1": "ๅ",
  "!": "+",
  "@": "1",
  "2": "/",
  "3": "-",
  "#": "2",
  "4": "ภ",
  $: "3",
  "5": "ถ",
  "%": "4",
  "6": "ุ",
  "^": "ู",
  "7": "ึ",
  "&": "฿",
  "8": "ค",
  "*": "5",
  "9": "ต",
  "(": "6",
  "0": "จ",
  ")": "7",
  "-": "ข",
  _: "8",
  "=": "ช",
  "+": "9",
  q: "ๆ",
  Q: "0",
  w: "ไ",
  W: '"',
  e: "ำ",
  E: "ฎ",
  r: "พ",
  R: "ฑ",
  t: "ะ",
  T: "ธ",
  y: "ั",
  Y: "ํ",
  u: "ี",
  U: "๊",
  i: "ร",
  I: "ณ",
  o: "น",
  O: "ฯ",
  p: "ย",
  P: "ญ",
  "[": "บ",
  "{": "ฐ",
  "]": "ล",
  "`": "-",
  "\\": "ฃ",
  "|": "ฅ",
  a: "ฟ",
  A: "ฤ",
  s: "ห",
  S: "ฆ",
  d: "ก",
  D: "ฏ",
  f: "ด",
  F: "โ",
  g: "เ",
  G: "ฌ",
  h: "้",
  H: "็",
  j: "่",
  J: "๋",
  k: "า",
  K: "ษ",
  l: "ส",
  L: "ศ",
  ";": "ว",
  ":": "ซ",
  "'": "ง",
  '"': ".",
  z: "ผ",
  Z: "(",
  x: "ป",
  X: ")",
  c: "แ",
  C: "ฉ",
  v: "อ",
  V: "ฮ",
  b: "ิ",
  B: "ฺ",
  n: "ท",
  N: "์",
  m: "ท",
  M: "?",
  ",": "ม",
  "<": "ฒ",
  ".": "ใ",
  ">": "ฬ",
  "/": "ฝ",
  "?": "ฦ",
} as const;

function toTargetLang(mapper: Record<string, string>) {
  return (text: string) => {
    return text
      .split("")
      .map((char) => {
        return mapper[char] || char;
      })
      .join("");
  };
}

const toThai = toTargetLang(KEY_MAPPING_ENG_TH);

export default function Index() {
  const [editorState, setEditorState] = useState({ from: "l;ylfu", to: "" });

  const handleEditorChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const nextState = { [name]: value };

      if (name === "from") {
        nextState.to = toThai(value);
      }

      setEditorState((prevState) => ({
        ...prevState,
        ...nextState,
      }));
    },
    []
  );

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="grid grid-cols-2 gap-4">
        <textarea
          className="w-full"
          name="from"
          value={editorState.from}
          onChange={handleEditorChange}
        ></textarea>
        <textarea
          className="w-full"
          name="to"
          value={editorState.to}
          onChange={handleEditorChange}
        ></textarea>
      </div>
    </div>
  );
}
