import baseConfig from "@racwa/eslint-config/base";
import reactConfig from "@racwa/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...reactConfig,
  ...baseConfig,
];
