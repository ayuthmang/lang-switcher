import { describe, expect, it } from "vitest";
import { EN_TH, TH_EN } from "./key-mapping";

const enTh: Record<string, string> = EN_TH;
const thEn: Record<string, string> = TH_EN;

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz".split("");
const UPPERCASE = LOWERCASE.map((c) => c.toUpperCase());

/** Keys of `mapping` grouped by the character they produce, collisions only. */
function collisions(mapping: Record<string, string>) {
  const byOutput = new Map<string, string[]>();
  for (const [key, output] of Object.entries(mapping)) {
    byOutput.set(output, [...(byOutput.get(output) ?? []), key]);
  }
  return Object.fromEntries(
    [...byOutput].filter(([, keys]) => keys.length > 1),
  );
}

describe.each([
  ["EN_TH", enTh],
  ["TH_EN", thEn],
])("%s", (_name, mapping) => {
  it("maps every entry to exactly one character", () => {
    const multiChar = Object.entries(mapping).filter(
      ([, value]) => [...value].length !== 1,
    );
    expect(multiChar).toEqual([]);
  });

  it("never maps a character to itself", () => {
    const identity = Object.entries(mapping).filter(([k, v]) => k === v);
    expect(identity).toEqual([]);
  });
});

describe("EN_TH", () => {
  it("covers every unshifted letter key", () => {
    expect(LOWERCASE.filter((c) => !(c in enTh))).toEqual([]);
  });

  it("covers every shifted letter key", () => {
    expect(UPPERCASE.filter((c) => !(c in enTh))).toEqual([]);
  });
});

describe("layout inverse", () => {
  it("EN_TH reverses every TH_EN entry", () => {
    const broken = Object.entries(thEn)
      .filter(([thai, english]) => enTh[english] !== thai)
      .map(
        ([thai, english]) =>
          `TH_EN[${thai}]=${english}, EN_TH[${english}]=${enTh[english]}`,
      );

    expect(broken).toEqual([]);
  });

  // -------------------------------------------------------------------
  // Known bugs. `it.fails()` means "expected to fail" — the suite stays
  // green while the bug is open and turns RED once it is fixed, prompting
  // us to drop the annotation.
  //
  // On the Thai Kedmanee layout the "3" key produces "-" and the "`" key
  // produces "_". EN_TH maps BOTH to "-", so the "`" key is lossy: TH_EN
  // can only reverse one of the two, and it picks "`".
  // -------------------------------------------------------------------

  it.fails("EN_TH has no two keys producing the same character", () => {
    expect(collisions(enTh)).toEqual({});
  });

  it.fails("TH_EN reverses every EN_TH entry", () => {
    const broken = Object.entries(enTh)
      .filter(([english, thai]) => thEn[thai] !== english)
      .map(
        ([english, thai]) =>
          `EN_TH[${english}]=${thai}, TH_EN[${thai}]=${thEn[thai]}`,
      );

    expect(broken).toEqual([]);
  });
});
