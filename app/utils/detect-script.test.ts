import { describe, expect, it } from "vitest";
import { detectScript } from "./detect-script";

describe("detectScript", () => {
  it("reports empty for text with no letters", () => {
    expect(detectScript("")).toBe("empty");
    expect(detectScript("  \n\t")).toBe("empty");
    expect(detectScript("123 !?")).toBe("empty");
  });

  it("recognises latin text", () => {
    expect(detectScript("l;ylfu")).toBe("latin");
    expect(detectScript("hello world")).toBe("latin");
  });

  it("recognises thai text", () => {
    expect(detectScript("สวัสดี")).toBe("thai");
    expect(detectScript("สวัสดี ครับ")).toBe("thai");
  });

  it("ignores characters shared by both layouts", () => {
    expect(detectScript("สวัสดี 123!")).toBe("thai");
    expect(detectScript("hello 123!")).toBe("latin");
  });

  it("tolerates a stray character of the other script", () => {
    // One latin character in a Thai sentence should not flip the verdict.
    expect(detectScript("สวัสดีครับผมชื่อ x")).toBe("thai");
  });

  it("reports mixed when neither script dominates", () => {
    expect(detectScript("hello สวัสดี")).toBe("mixed");
  });
});
