/* 
Server access only since we're accessing variables dynamically from process.env

"If you need access to runtime environment values, 
 you'll have to setup your own API to provide them to the client (either on demand or during initialization)."
- https://nextjs.org/docs/14/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
*/
import "server-only";

import { z } from "zod";

const isLocal = process.env.CONTAINER_APP_ENV === "local";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_AUTH_BASE_PATH: z.string().min(1),
  NEXT_PUBLIC_GTM_ID: isLocal ? z.string() : z.string().min(1),
  NEXT_PUBLIC_RAC_HOMEPAGE_URL: z.string().url(),
  // TODO - NEXT_PUBLIC_RAC_TERMS_URL var uses NEXT_PUBLIC_RAC_HOMEPAGE_URL, can z.string().url() be used instead?
  NEXT_PUBLIC_RAC_TERMS_URL: z.string().min(1),
});

export const clientEnv = () => {
  const result = clientEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Error parsing client environment variables");
    console.error(result.error);

    throw new Error(result.error.message);
  }

  return result.data;
};
