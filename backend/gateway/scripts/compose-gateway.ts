import { execSync } from "child_process";

import initApplicationConfiguration from "@racwa/app-config";

try {
  const environment = process.env.CONTAINER_APP_ENV?.trim();
  if (!environment) {
    throw new Error(
      "Missing environment variable 'CONTAINER_APP_ENV' which is required for Application Configuration.",
    );
  }

  await initApplicationConfiguration(environment);
  execSync("pnpm mesh-compose -o supergraph.graphql", { stdio: "inherit" });
} catch (error) {
  console.error(`Error composing gateway: ${error}`);
}
