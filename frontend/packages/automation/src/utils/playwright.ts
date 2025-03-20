import { normalize } from "path";
import type { devices, Page } from "@playwright/test";
import test from "@playwright/test";

export type Device = keyof {
  [K in keyof typeof devices as string extends K ? never : K]: (typeof devices)[K];
};

export const getScreenshotDir = () => {
  const [area, flow, device] = test
    .info()
    .project.name.split("-")
    .map((s) => s.trim());

  if (!area || !flow || !device) {
    console.log(`[getScreenshotDir]: Test project name is missing part`, { area, flow, device });
    throw new Error("Test project name is missing part");
  }

  const { title } = test.info();

  return normalize(`${area}/${flow}/${device}/${title}`);
};

/**
 * Takes a screenshot of the browser window for test evidence
 * @param page The Playwright page object
 * @param dirPath Directory within ./playwright-screenshots to save the screenshot to
 * @param filename Filename for the screenshot
 * @param maskPii Optional flag to hide PII data (via [data-mask-pii])
 */
export const takeScreenshot = async ({
  page,
  dirPath,
  filename,
  maskPii = true,
}: {
  page: Page;
  dirPath: string;
  filename: `${string}.png`;
  maskPii?: boolean;
}) => {
  if (maskPii) {
    await page.evaluate(maskSensitiveInformation);
  }

  await page.screenshot({
    path: normalize(`./playwright-screenshots/${dirPath}/${filename}`),
    fullPage: true,
  });
};

/**
 * Masks text elements on the screen that contain the 'data-mask-pii' attribute
 */
const maskSensitiveInformation = () => {
  const sensitiveElements = document.querySelectorAll("[data-mask-pii]");

  sensitiveElements.forEach((sensitiveElement) => {
    if (sensitiveElement instanceof HTMLInputElement || sensitiveElement instanceof HTMLTextAreaElement) {
      sensitiveElement.value = sensitiveElement.value.replace(/\S/g, "X");
    } else {
      sensitiveElement.textContent = sensitiveElement.textContent?.replace(/\S/g, "X") ?? "XXX";
    }
  });
};
