import type { Page } from "@playwright/test";

/**
 * "สวัสดี" (hello) typed on a Thai layout while the OS is still on English.
 * This is the canonical case the app exists to fix.
 */
export const HELLO_EN_KEYS = "l;ylfu";
export const HELLO_TH = "สวัสดี";

export function converter(page: Page) {
  return {
    from: page.getByLabel(/^From/),
    to: page.getByLabel(/^To/),
    fromLabel: page.getByText(/^From \(/),
    toLabel: page.getByText(/^To \(/),
    swap: page.getByRole("button", { name: /swap lang/i }),
    clear: page.getByRole("button", { name: /clear/i }),
  };
}
