import "server-only";

import { cookies } from "next/headers";

import { createCookieString, createValidationString, getUUID } from "../cryptography";

const DOMAIN = process.env.NEXTAUTH_URL?.includes("rac.com.au") ? "rac.com.au" : "ractest.com.au";

async function setPCMCookie(crmId: string) {
  if (!crmId) {
    return;
  }

  const cookieStore = await cookies();
  const uuid = getUUID(crmId);
  if (!uuid) {
    return;
  }

  const encryptedUUID = createCookieString(uuid);
  const encryptedValidation = createValidationString(uuid);
  if (!encryptedUUID || !encryptedValidation) {
    return;
  }

  cookieStore.set({
    name: "UUID",
    value: encryptedUUID,
    httpOnly: true,
    path: "/",
    secure: true,
    domain: DOMAIN,
  });

  cookieStore.set({
    name: "Validation",
    value: encryptedValidation,
    httpOnly: true,
    path: "/",
    secure: true,
    domain: DOMAIN,
  });
}

export default setPCMCookie;
