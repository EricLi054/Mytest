import "@testing-library/jest-dom/vitest";

import path from "path";
import { fileURLToPath } from "url";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import initApplicationConfiguration from "@racwa/app-config";

process.chdir(path.dirname(fileURLToPath(import.meta.url)));
await initApplicationConfiguration("test", false);

// globals are disabled, testing-library will not run auto DOM cleanup.
// hence the below code
afterEach(() => {
  cleanup();
});
