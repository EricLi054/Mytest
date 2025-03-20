"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { RacwaSplashScreen } from "@racwa/react-components";

import type { CreateSessionArgs } from "./actions";
import { getUpdateYourVehiclePageUrl } from "../routing";
import { createSession } from "./actions";

export default function CreateSession({ productHoldingHeaderId, productHoldingLineId }: CreateSessionArgs) {
  const router = useRouter();

  useEffect(() => {
    const create = async (args: CreateSessionArgs) => {
      try {
        const nextPage = await createSession(args);
        router.replace(getUpdateYourVehiclePageUrl({ page: nextPage }));
      } catch {
        router.replace(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
      }
    };

    void create({ productHoldingHeaderId, productHoldingLineId });
  }, [router, productHoldingHeaderId, productHoldingLineId]);

  return <RacwaSplashScreen id="update-your-vehicle-session-splash-screen" />;
}
