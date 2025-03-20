import "@testing-library/jest-dom/vitest";

import path from "path";
import { fileURLToPath } from "url";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, vi } from "vitest";

import initApplicationConfiguration from "@racwa/app-config";

process.chdir(path.dirname(fileURLToPath(import.meta.url)));
await initApplicationConfiguration("test", false);

library.add(fas);
library.add(fab);

vi.mock("@racwa/analytics", async () => {
  const actual = await vi.importActual("@racwa/analytics");

  return {
    ...actual,
    gtm: vi.fn(),
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
