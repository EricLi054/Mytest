"use server";

import { cookies } from "next/headers";
import { trace } from "@opentelemetry/api";
import { uyvSessionIdCookieName } from "#constants";

export async function deleteSessionCookie() {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("delete-session-span");

  const cookieStore = await cookies();
  cookieStore.delete(uyvSessionIdCookieName);

  span.end();
}
