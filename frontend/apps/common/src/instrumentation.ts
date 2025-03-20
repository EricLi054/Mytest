import { clientEnv } from "#env/client";
import { serverEnv } from "#env/server";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const environment = process.env.CONTAINER_APP_ENV?.trim();
    if (!environment) {
      throw new Error(
        "Missing environment variable 'CONTAINER_APP_ENV' which is required for Application Configuration.",
      );
    }

    const { default: initApplicationConfiguration } = await import("@racwa/app-config");
    await initApplicationConfiguration(environment);

    // Access environment variables to trigger validation
    clientEnv();
    const { NODE_ENV } = serverEnv();

    if (NODE_ENV === "production") {
      const { init } = await import("@racwa/otel");
      init("@racwa/common");
    }
  }
}
