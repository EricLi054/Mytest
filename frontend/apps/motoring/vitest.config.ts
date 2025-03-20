import { defineProject, mergeConfig } from "vitest/config";

import { reactConfig } from "@racwa/vitest-config";

export default mergeConfig(
  reactConfig,
  defineProject({
    test: {
      setupFiles: "setupTests.ts",
      globals: true,
      environment: "jsdom",
      include: ["src/**/*.(spec|test).(ts|js|tsx|jsx)"],
    },
  }),
);
