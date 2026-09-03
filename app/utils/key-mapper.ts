import { EN_TH, TH_EN } from "~/constants/key-mapping";

/**
 * Builds a transformer that rewrites text one character at a time using a
 * keyboard-layout map. Characters with no entry in the map (spaces, line
 * breaks, punctuation shared by both layouts) are passed through untouched.
 */
export function buildKeyMapper(mapping: Record<string, string>) {
  return (text: string): string =>
    text
      .split("")
      .map((char) => mapping[char] ?? char)
      .join("");
}

/** Reinterprets English keystrokes as the Thai text they were meant to be. */
export const enToTh = buildKeyMapper(EN_TH);

/** Reinterprets Thai keystrokes as the English text they were meant to be. */
export const thToEn = buildKeyMapper(TH_EN);
