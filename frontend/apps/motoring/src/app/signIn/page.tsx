"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

import { RacwaSplashScreen } from "@racwa/react-components";

export default function Signin(): React.ReactElement {
  const searchParams = useSearchParams();
  const { status } = useSession();
  const router = useRouter();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    document.title = "Log In to RAC WA";
    if (status === "loading") return;

    const doAuthentication = async () => {
      if (searchParams.get("error")) {
        return setHasError(true);
      }

      const callback = searchParams.get("callbackUrl") ?? "/myRAC";
      if (status === "unauthenticated" || searchParams.get("refresh")) {
        return await signIn("azure-ad-b2c", { callbackUrl: callback });
      }

      router.push(callback);
    };

    void doAuthentication();
  }, [status, searchParams, router]);

  if (hasError) {
    throw new Error("Authentication error");
  }

  return <RacwaSplashScreen />;
}
