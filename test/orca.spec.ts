import { expect } from "@playwright/test";
import { orcaTest as test } from "@guidepup/playwright";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const expectedHeading = "Guidepup Smoke Test Page Heading";

test("Orca reads page content in Firefox", async ({ page, orca }) => {
  await page.goto("about:blank", {
    waitUntil: "load",
  });

  await page.setContent(
    `<!doctype html>
<html>
  <head>
    <title>Guidepup Smoke Test</title>
  </head>
  <body>
    <main>
      <h1>${expectedHeading}</h1>
    </main>
  </body>
</html>`,
  );

  await page.locator("h1").waitFor();
  await delay(500);

  await orca.navigateToWebContent();
  await delay(500);

  await orca.next();
  await orca.next();

  const spokenPhrases = (await orca.spokenPhraseLog()).join("\n");

  expect(spokenPhrases).toContain(expectedHeading);
});
