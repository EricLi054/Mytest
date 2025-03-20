"use server";

import { headers } from "next/headers";

export default async function getHeader(headerName: string) {
  const headerStore = await headers();
  return headerStore.get(headerName);
}
