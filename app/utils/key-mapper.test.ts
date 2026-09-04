import { describe, expect, it } from "vitest";
import { buildKeyMapper, enToTh, thToEn } from "./key-mapper";

// "สวัสดี" (hello), typed on a Thai layout while the OS was still on English.
const HELLO_EN_KEYS = "l;ylfu";
const HELLO_TH = "สวัสดี";

describe("buildKeyMapper", () => {
  const map = buildKeyMapper({ a: "x", b: "y" });

  it("rewrites mapped characters", () => {
    expect(map("ab")).toBe("xy");
  });

  it("passes unmapped characters through untouched", () => {
    expect(map("a c b")).toBe("x c y");
  });

  it("returns an empty string unchanged", () => {
    expect(map("")).toBe("");
  });

  it("preserves line breaks and whitespace runs", () => {
    expect(map("a\n\tb  a")).toBe("x\n\ty  x");
  });

  it("leaves astral characters intact", () => {
    // split("") tears surrogate pairs apart; neither half is ever a map key,
    // so both are passed through and join back into the original character.
    expect(map("a😀b")).toBe("x😀y");
  });
});

describe("enToTh", () => {
  it("converts english keystrokes into the intended thai text", () => {
    expect(enToTh(HELLO_EN_KEYS)).toBe(HELLO_TH);
  });

  it("handles shifted characters", () => {
    // "ฤกษ์" — shift-A, d, shift-K, shift-N
    expect(enToTh("AdKN")).toBe("ฤกษ์");
  });

  it("leaves thai text alone", () => {
    expect(enToTh(HELLO_TH)).toBe(HELLO_TH);
  });

  it("leaves characters outside both layouts alone", () => {
    expect(enToTh("© 😀")).toBe("© 😀");
  });
});

describe("thToEn", () => {
  it("converts thai keystrokes back into the intended english text", () => {
    expect(thToEn(HELLO_TH)).toBe(HELLO_EN_KEYS);
  });

  it("leaves characters outside both layouts alone", () => {
    expect(thToEn("© 😀")).toBe("© 😀");
  });
});

describe("round trip", () => {
  it("returns the original english text after a there-and-back conversion", () => {
    expect(thToEn(enToTh(HELLO_EN_KEYS))).toBe(HELLO_EN_KEYS);
  });

  it("returns the original thai text after a there-and-back conversion", () => {
    expect(enToTh(thToEn(HELLO_TH))).toBe(HELLO_TH);
  });

  it("round trips every letter of the english alphabet", () => {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    expect(thToEn(enToTh(letters))).toBe(letters);
    expect(thToEn(enToTh(letters.toUpperCase()))).toBe(letters.toUpperCase());
  });
});
