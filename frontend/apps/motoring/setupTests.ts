import { mockDataCache } from "#testing/cache";

import "@testing-library/jest-dom/vitest";

import path from "path";
import { fileURLToPath } from "url";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, vi } from "vitest";

import initApplicationConfiguration from "@racwa/app-config";

process.chdir(path.dirname(fileURLToPath(import.meta.url)));
await initApplicationConfiguration("test", false);

vi.mock("@racwa/analytics", async () => {
  const actual = await vi.importActual("@racwa/analytics");

  return {
    ...actual,
    gtm: vi.fn(),
  };
});

vi.mock("@racwa/cache", async () => {
  const actual = await vi.importActual("@racwa/cache");

  return {
    ...actual,
    getCacheFor: () => mockDataCache(),
  };
});

beforeAll(() => {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  process.env.DEBUG_PRINT_LIMIT = "20000"; // Default=7000
});

// globals are disabled, testing-library will not run auto DOM cleanup.
// hence the below code
afterEach(() => {
  cleanup();
});
