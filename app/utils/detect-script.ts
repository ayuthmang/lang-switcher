/** Thai block, U+0E00–U+0E7F. */
const THAI = /[฀-๿]/;
const LATIN = /[A-Za-z]/;

export type Script = "empty" | "thai" | "latin" | "mixed";

/**
 * Classifies text by the script the reader is looking at, so the UI can tell
 * when someone is converting in the wrong direction. Characters shared by both
 * layouts (digits, punctuation, whitespace) are ignored.
 */
export function detectScript(text: string): Script {
  let thai = 0;
  let latin = 0;

  for (const char of text) {
    if (THAI.test(char)) thai++;
    else if (LATIN.test(char)) latin++;
  }

  if (thai === 0 && latin === 0) return "empty";
  if (thai === 0) return "latin";
  if (latin === 0) return "thai";
  // A stray character of the other script should not flip the verdict.
  const total = thai + latin;
  if (thai / total >= 0.8) return "thai";
  if (latin / total >= 0.8) return "latin";
  return "mixed";
}
