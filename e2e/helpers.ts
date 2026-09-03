import type { Page } from "@playwright/test";

/**
 * "สวัสดี" (hello) typed on a Thai layout while the OS is still on English.
 * This is the canonical case the app exists to fix.
 */
export const HELLO_EN_KEYS = "l;ylfu";
export const HELLO_TH = "สวัสดี";

export function converter(page: Page) {
  return {
    from: page.getByLabel(/^You typed/),
    to: page.getByLabel(/^You meant/),
    // The language pill inside each pane's label.
    fromLanguage: page.locator('label[for="from"] > span').last(),
    toLanguage: page.locator('label[for="to"] > span').last(),
    swap: page.getByRole("button", { name: /swap languages/i }),
    clear: page.getByRole("button", { name: /clear/i }),
    copy: page.getByRole("button", { name: /cop(y|ied)/i }),
    hint: page.getByRole("status"),
    legend: page.getByRole("listitem"),
  };
}
