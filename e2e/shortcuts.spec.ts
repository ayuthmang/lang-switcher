import { test, expect } from "@playwright/test";
import { converter, HELLO_EN_KEYS, HELLO_TH } from "./helpers";

// "ControlOrMeta" resolves to Cmd on macOS and Ctrl elsewhere, matching what
// the app listens for.
const MOD = "ControlOrMeta";

test.use({ permissions: ["clipboard-read", "clipboard-write"] });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

async function clipboard(page: import("@playwright/test").Page) {
  return page.evaluate(() => navigator.clipboard.readText());
}

test.describe("copy", () => {
  test("the copy button puts the output on the clipboard", async ({ page }) => {
    const c = converter(page);

    await c.from.fill(HELLO_EN_KEYS);
    await expect(c.to).toHaveValue(HELLO_TH);

    await c.copy.click();

    expect(await clipboard(page)).toBe(HELLO_TH);
  });

  test("the copy button confirms, then reverts", async ({ page }) => {
    const c = converter(page);

    await c.from.fill(HELLO_EN_KEYS);
    await c.copy.click();

    await expect(c.copy).toHaveText(/copied/i);
    await expect(c.copy).toHaveText(/^copy/i, { timeout: 4000 });
  });

  test("mod+enter copies without leaving the keyboard", async ({ page }) => {
    const c = converter(page);

    await c.from.fill(HELLO_EN_KEYS);
    await expect(c.to).toHaveValue(HELLO_TH);

    await page.keyboard.press(`${MOD}+Enter`);

    expect(await clipboard(page)).toBe(HELLO_TH);
  });

  test("copying is unavailable while there is no output", async ({ page }) => {
    await expect(converter(page).copy).toBeDisabled();
  });
});

test.describe("keyboard shortcuts", () => {
  test("mod+shift+s swaps direction", async ({ page }) => {
    const c = converter(page);

    await c.from.fill(HELLO_EN_KEYS);
    await expect(c.to).toHaveValue(HELLO_TH);

    await page.keyboard.press(`${MOD}+Shift+S`);

    await expect(c.fromLanguage).toHaveText("ไทย");
    await expect(c.from).toHaveValue(HELLO_TH);
    await expect(c.to).toHaveValue(HELLO_EN_KEYS);
  });

  test("mod+shift+k clears and returns focus to the input", async ({
    page,
  }) => {
    const c = converter(page);

    await c.from.fill(HELLO_EN_KEYS);
    await c.to.click(); // move focus away from the input

    await page.keyboard.press(`${MOD}+Shift+K`);

    await expect(c.from).toHaveValue("");
    await expect(c.to).toHaveValue("");
    await expect(c.from).toBeFocused();
  });

  test("slash focuses the input from anywhere on the page", async ({
    page,
  }) => {
    const c = converter(page);

    await c.from.fill(HELLO_EN_KEYS);
    await page.getByRole("banner").click(); // blur the input

    await page.keyboard.press("/");

    await expect(c.from).toBeFocused();
  });

  test("slash types normally while the input has focus", async ({ page }) => {
    const c = converter(page);

    await c.from.click();
    await page.keyboard.type("a/b");

    await expect(c.from).toHaveValue("a/b");
  });

  test("lists every shortcut in the legend", async ({ page }) => {
    await expect(converter(page).legend).toHaveText([
      /Copy/,
      /Swap/,
      /Clear/,
      /Focus/,
    ]);
  });
});

test.describe("wrong-direction hint", () => {
  test("suggests swapping when the input is the other script", async ({
    page,
  }) => {
    const c = converter(page);

    await expect(c.hint).toBeEmpty();

    await c.from.fill(HELLO_TH); // Thai text while set to en -> th

    await expect(c.hint).toContainText(/looks like ไทย/i);
    await expect(c.hint).toContainText(/swap/i);
  });

  test("stays quiet when the direction is right", async ({ page }) => {
    const c = converter(page);

    await c.from.fill(HELLO_EN_KEYS);

    await expect(c.hint).toBeEmpty();
  });

  test("clears once the direction is swapped", async ({ page }) => {
    const c = converter(page);

    await c.from.fill(HELLO_TH);
    await expect(c.hint).toContainText(/looks like/i);

    await c.swap.click();

    await expect(c.hint).toBeEmpty();
  });
});
