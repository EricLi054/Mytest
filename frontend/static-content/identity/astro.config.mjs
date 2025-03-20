// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  outDir: process.env.BUILD_DIRECTORY,
  build: {
    assetsPrefix: process.env.ASSETS_PREFIX,
  },
});
