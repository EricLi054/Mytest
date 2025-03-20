import baseConfig from "@racwa/eslint-config/base";
import nextjsConfig from "@racwa/eslint-config/nextjs";
import reactConfig from "@racwa/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
];
