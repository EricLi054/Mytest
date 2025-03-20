"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

import { getADB2CUpdatePasswordUrl } from "@racwa/auth/adb2c";
import { RacwaLoadingModal } from "@racwa/react-components";

export default function UpdatePassword(): React.ReactElement {
  const router = useRouter();
  const params = useSearchParams();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn("azure-ad-b2c", { callbackUrl: "/oidc/updatePassword" }).catch((error) => {
        console.error(error);
        router.push("/");
      });
    },
  });

  useEffect(() => {
    const doRedirect = async () => {
      if (status === "authenticated") {
        const redirectUri = params.get("state");
        if (redirectUri) {
          router.push(redirectUri);
        } else {
          const redirectUrl = "/myrac/profile/contact-details";
          const updatePasswordUrl = await getADB2CUpdatePasswordUrl(redirectUrl, window.location.href);
          router.push(updatePasswordUrl);
        }
      }
    };

    void doRedirect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <RacwaLoadingModal open={true} />;
}
