"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

import { getADB2CUpdateEmailUrl } from "@racwa/auth/adb2c";
import { RacwaLoadingModal } from "@racwa/react-components";

export default function UpdateEmail(): React.ReactElement {
  const router = useRouter();
  const params = useSearchParams();
  const { status, update } = useSession({
    required: true,
    onUnauthenticated() {
      signIn("azure-ad-b2c", { callbackUrl: "/oidc/updateEmail" }).catch((error) => {
        console.error(error);
        router.push("/");
      });
    },
  });

  useEffect(() => {
    const doRedirect = async () => {
      if (status === "authenticated") {
        const redirectUri = params.get("state");
        const code = params.get("code");

        if (redirectUri) {
          if (code) {
            await update({ code });
            router.push(redirectUri);
          } else {
            router.push(redirectUri);
          }
        } else {
          const redirectUrl = "/myrac/profile/contact-details";

          const updateEmailUrl = await getADB2CUpdateEmailUrl(redirectUrl, window.location.href);

          router.push(updateEmailUrl);
        }
      }
    };

    void doRedirect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <RacwaLoadingModal open={true} />;
}
