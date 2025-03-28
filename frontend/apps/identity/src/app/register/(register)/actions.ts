"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { trace } from "@opentelemetry/api";
import { serverEnv } from "#env/server";
import { annotatedLog } from "#utils/logging";
import { getRegistrationPageUrl } from "#utils/routing";
import { createRegistrationSession, extractRedirectUrl, SESSION_COOKIE_NAME } from "#utils/session";

import { beforeYouStartSchema } from "./schema";

export type CreateSessionAction = typeof createSessionAction;

const log = (message: string, sessionId?: string) => annotatedLog("createSessionAction", message, sessionId);

const { VALID_REDIRECT_HOSTS } = serverEnv();

export async function createSessionAction(_: unknown, formData: FormData) {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("create-session-span");

  log("Starting action to create session");

  const submission = parseWithZod(formData, {
    schema: beforeYouStartSchema,
  });

  if (submission.status !== "success") {
    log("Invalid form data");
    span.end();
    return submission.reply();
  }

  const cookieStore = await cookies();
  const headersStore = await headers();

  cookieStore.delete(SESSION_COOKIE_NAME);

  const redirectUrl = extractRedirectUrl(headersStore.get("referer"), VALID_REDIRECT_HOSTS, log);
  const sessionId = await createRegistrationSession(redirectUrl);
  log("Session created successfully", sessionId);

  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  });

  log("Navigating to member match", sessionId);
  span.end();
  return redirect(getRegistrationPageUrl({ page: "/match" }));
}

export async function deleteSessionAction() {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("delete-session-span");
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);

  span.end();
}
