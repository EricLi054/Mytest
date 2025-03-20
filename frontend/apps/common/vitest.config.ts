import { defineProject, mergeConfig } from "vitest/config";

import { reactConfig } from "@racwa/vitest-config";

export default mergeConfig(
  reactConfig,
  defineProject({
    test: {
      setupFiles: "setupTests.ts",
      globals: true,
      environment: "jsdom",
      env: {
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "racwa",
      },
    },
  }),
);
