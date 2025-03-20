"use client";

import { useEffect } from "react";
import { deleteSessionAction } from "#app/register/(register)/actions";
import { signOut } from "next-auth/react";

export default function ClearSession() {
  useEffect(() => {
    const clearSession = async () => {
      try {
        await deleteSessionAction();
        await signOut({ redirect: false });
      } catch {
        /* 
        If the request to delete the session cookie fails, that's okay.
        Subsequent page reloads or attempting to restart the flow will attempt to delete cookie again.
        Either by rendering this page again, or creating a new session.

        NOTE: You cannot access HttpOnly cookies with client side javascript.
        
        NOTE: With Next.js, you can only delete/set cookies in an API route or server action, 
              as cookies are readonly in server components.
              See: https://nextjs.org/docs/14/app/api-reference/functions/cookies
        */
      }
    };

    void clearSession();
  }, []);

  return <></>;
}
