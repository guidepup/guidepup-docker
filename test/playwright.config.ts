import { devices, defineConfig } from "@playwright/test";
import { withGuidepup } from "@guidepup/playwright";

export default withGuidepup(
  defineConfig({
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
