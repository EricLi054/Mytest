"use server";

import { cookies } from "next/headers";

export default async function checkHasCookie(cookieName: string) {
  const cookieStore = await cookies();
  return cookieStore.has(cookieName);
}
