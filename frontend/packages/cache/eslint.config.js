import baseConfig from "@racwa/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  ...baseConfig,
  {
    ignores: [],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
];
