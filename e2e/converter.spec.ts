import { test, expect } from "@playwright/test";
import { converter, HELLO_EN_KEYS, HELLO_TH } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("page shell", () => {
  test("renders both editors, starting in en -> th", async ({ page }) => {
    const c = converter(page);

    await expect(c.fromLabel).toHaveText("From (en)");
    await expect(c.toLabel).toHaveText("To (th)");
    await expect(c.from).toHaveValue("");
    await expect(c.to).toHaveValue("");
    await expect(c.to).toHaveAttribute("readonly", "");
  });
});

test.describe("en -> th conversion", () => {
  test("converts english keystrokes to the thai text they were meant to be", async ({
    page,
  }) => {
    const c = converter(page);

    await c.from.fill(HELLO_EN_KEYS);

    await expect(c.to).toHaveValue(HELLO_TH);
  });

  test("converts as the user types, not only on blur", async ({ page }) => {
    const c = converter(page);

    await c.from.pressSequentially("l;yl");
    await expect(c.to).toHaveValue("สวัส");

    await c.from.pressSequentially("fu");
    await expect(c.to).toHaveValue(HELLO_TH);
  });

  test("passes through characters that have no mapping", async ({ page }) => {
    const c = converter(page);

    // Neither layout can produce these, so they are emitted as-is.
    await c.from.fill(`${HELLO_EN_KEYS} © 😀`);

    await expect(c.to).toHaveValue(`${HELLO_TH} © 😀`);
  });

  test("preserves line breaks", async ({ page }) => {
    const c = converter(page);

    await c.from.fill("l;ylfu\nl;ylfu");

    await expect(c.to).toHaveValue(`${HELLO_TH}\n${HELLO_TH}`);
  });

  test("clearing the input clears the output", async ({ page }) => {
    const c = converter(page);

    await c.from.fill(HELLO_EN_KEYS);
    await expect(c.to).toHaveValue(HELLO_TH);

    await c.from.fill("");

    await expect(c.to).toHaveValue("");
  });
});

test.describe("clear button", () => {
  test("empties both editors and returns focus to the input", async ({
    page,
  }) => {
    const c = converter(page);

    await c.from.fill(HELLO_EN_KEYS);
    await expect(c.to).toHaveValue(HELLO_TH);

    await c.clear.click();

    await expect(c.from).toHaveValue("");
    await expect(c.to).toHaveValue("");
    await expect(c.from).toBeFocused();
  });
});

test.describe("swap", () => {
  test("flips the direction labels", async ({ page }) => {
    const c = converter(page);

    await c.swap.click();

    await expect(c.fromLabel).toHaveText("From (th)");
    await expect(c.toLabel).toHaveText("To (en)");

    await c.swap.click();

    await expect(c.fromLabel).toHaveText("From (en)");
    await expect(c.toLabel).toHaveText("To (th)");
  });

  test("moves the converted text into the input", async ({ page }) => {
    const c = converter(page);

    await c.from.fill(HELLO_EN_KEYS);
    await expect(c.to).toHaveValue(HELLO_TH);

    await c.swap.click();

    await expect(c.from).toHaveValue(HELLO_TH);
  });

  test("output pane holds the reverse conversion after a swap", async ({
    page,
  }) => {
    const c = converter(page);

    await c.from.fill(HELLO_EN_KEYS);
    await expect(c.to).toHaveValue(HELLO_TH);

    await c.swap.click();

    await expect(c.to).toHaveValue(HELLO_EN_KEYS);
  });

  test("typing after a swap converts th -> en", async ({ page }) => {
    const c = converter(page);

    await c.swap.click();
    await expect(c.fromLabel).toHaveText("From (th)");

    await c.from.fill(HELLO_TH);

    await expect(c.to).toHaveValue(HELLO_EN_KEYS);
  });
});
