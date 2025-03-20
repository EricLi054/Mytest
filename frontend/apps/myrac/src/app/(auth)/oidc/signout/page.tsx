"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import getHeader from "#utils/headers/getHeader";
import { signOut } from "next-auth/react";

import { getADB2CLogoutUrl } from "@racwa/auth/adb2c";
import { RacwaLoadingModal } from "@racwa/react-components";

export default function SignOutPage(): React.ReactElement {
  const router = useRouter();

  useEffect(() => {
    const signOutAsync = async () => {
      const referer = await getHeader("Referer");
      const logoutUrl = await getADB2CLogoutUrl(window.location.origin);

      // only navigate to ADB2C page if we came here from our application
      // don't want this if we hit this page from ADB2C SSO
      if (referer?.startsWith(window.location.origin)) {
        await signOut({ redirect: false });
        router.push(logoutUrl);
      } else {
        await signOut({ callbackUrl: "/" });
      }
    };
    void signOutAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <RacwaLoadingModal open={true} />;
}
