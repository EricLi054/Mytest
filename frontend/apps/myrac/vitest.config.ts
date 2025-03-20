import { defineConfig, defineProject, mergeConfig } from "vitest/config";

import { reactConfig } from "@racwa/vitest-config";

export default mergeConfig(
  mergeConfig(
    reactConfig,
    defineConfig({
      test: {
        onConsoleLog(log: string, type: "stdout" | "stderr"): boolean | void {
          if (log.startsWith("@racwa/app-config") && type === "stdout") {
            return false;
          }
        },
      },
    }),
  ),
  defineProject({
    test: {
      setupFiles: "setupTests.ts",
      globals: true,
      environment: "jsdom",
      include: ["src/**/*.(spec|test).(ts|js|tsx|jsx)"],
    },
  }),
);
