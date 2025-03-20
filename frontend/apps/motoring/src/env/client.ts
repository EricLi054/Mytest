/* 
Server access only since we're accessing variables dynamically from process.env

"If you need access to runtime environment values, 
 you'll have to setup your own API to provide them to the client (either on demand or during initialization)."
- https://nextjs.org/docs/14/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
*/
import "server-only";

import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_AUTH_BASE_PATH: z.string().min(1),
  NEXT_PUBLIC_RAC_HOMEPAGE_URL: z.string().url(),
  NEXT_PUBLIC_ROADSIDE_ASSISTANCE_ENTITLEMENTS_URL: z.string().url(),
  NEXT_PUBLIC_GTM_ID: z.string().min(1),
  NEXT_PUBLIC_RAC_ABOUT_PRIVACY_URL: z.string().url(),
  NEXT_PUBLIC_RAC_ABOUT_SECURITY_URL: z.string().url(),
  NEXT_PUBLIC_RAC_ABOUT_DISCLAIMER_URL: z.string().url(),
  NEXT_PUBLIC_RAC_ABOUT_ACCESSIBILITY_URL: z.string().url(),
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
