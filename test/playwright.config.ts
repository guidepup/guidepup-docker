import { devices, defineConfig } from "@playwright/test";
import { withGuidepup } from "@guidepup/playwright";

export default withGuidepup(
  defineConfig({
    reportSlowTests: null,
    timeout: 5 * 60 * 1000,
    retries: 5,
    projects: [
      {
        name: "firefox",
        use: { ...devices["Desktop Firefox"] },
      },
    ],
    reporter: process.env.CI
      ? [["github"], ["html", { open: "never" }]]
      : "list",
  }),
);
