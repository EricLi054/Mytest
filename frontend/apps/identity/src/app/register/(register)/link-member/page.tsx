"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRegistrationErrorPageUrl } from "#utils/routing";
import { useSession } from "next-auth/react";

import { linkMemberAction } from "./actions";
import LinkMemberModal from "./LinkMemberModal";

export default function LinkMemberPage() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    const performMemberLinking = async () => {
      await linkMemberAction();
    };

    if (session.status === "authenticated") {
      void performMemberLinking();
    } else {
      router.replace(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
    }
  }, [router, session.status]);

  return <LinkMemberModal />;
}
