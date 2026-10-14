import { expect } from "@playwright/test";
import { orcaTest as test } from "@guidepup/playwright";

const expectedHeading = "Guidepup Smoke Test Page Heading";

test("Orca reads page content in Firefox", async ({ page, orca }) => {
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

  await orca.navigateToWebContent();

  await orca.next();
  await orca.next();

  const spokenPhrases = (await orca.spokenPhraseLog()).join("\n");

  expect(spokenPhrases).toContain(expectedHeading);
});
