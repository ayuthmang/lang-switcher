import { test, expect, type Page } from "@playwright/test";

function themeMenu(page: Page) {
  return {
    html: page.locator("html"),
    trigger: page.getByRole("button", { name: /toggle theme/i }),
    async pick(name: "System" | "Light" | "Dark") {
      await this.trigger.click();
      await page.getByRole("menuitem", { name }).click();
    },
  };
}

test.describe("theme toggle", () => {
  test("applies the dark class when dark is picked", async ({ page }) => {
    await page.goto("/");
    const t = themeMenu(page);

    await t.pick("Dark");

    await expect(t.html).toHaveClass(/dark/);
  });

  test("removes the dark class when light is picked", async ({ page }) => {
    await page.goto("/");
    const t = themeMenu(page);

    await t.pick("Dark");
    await expect(t.html).toHaveClass(/dark/);

    await t.pick("Light");

    await expect(t.html).not.toHaveClass(/dark/);
  });

  test("follows the OS preference when system is picked", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    const t = themeMenu(page);

    await t.pick("Light");
    await expect(t.html).not.toHaveClass(/dark/);

    await t.pick("System");

    await expect(t.html).toHaveClass(/dark/);
  });

  test("reacts to the OS preference changing while system is active", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const t = themeMenu(page);

    await t.pick("System");
    await expect(t.html).not.toHaveClass(/dark/);

    await page.emulateMedia({ colorScheme: "dark" });

    await expect(t.html).toHaveClass(/dark/);
  });

  // ---------------------------------------------------------------------
  // Known bug — see app/components/mode-toggle.tsx: a mount effect calls
  // handleThemeChange("system") unconditionally, so an explicit choice is
  // discarded on every page load.
  // ---------------------------------------------------------------------
  test.fail("BUG: an explicit theme choice should survive a reload", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    const t = themeMenu(page);

    await t.pick("Light");
    await expect(t.html).not.toHaveClass(/dark/);

    await page.reload();
    // The server renders the cookie's theme, so the class is briefly correct
    // even when the bug is present. Wait for the menu to open — Radix only
    // responds once React has hydrated and run its mount effects — so we
    // assert the settled theme rather than the SSR one.
    await t.trigger.click();
    await expect(page.getByRole("menuitem", { name: "System" })).toBeVisible();
    await page.keyboard.press("Escape");

    await expect(t.html).not.toHaveClass(/dark/);
  });
});
