import { defineProject, mergeConfig } from "vitest/config";

import { reactConfig } from "@racwa/vitest-config";

export default mergeConfig(
  reactConfig,
  defineProject({
    test: {
      globals: true,
      environment: "jsdom",
    },
  }),
);
