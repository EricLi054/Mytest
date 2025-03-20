"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export type TimeoutProps = {
  sessionTtl: number;
  sessionTimeoutUrl: string;
};

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout#maximum_delay_value
 */
const SET_TIMEOUT_DELAY_MAX = 0x7fffffff;
const SET_TIMEOUT_DELAY_MIN = 0;

/**
 * Leave a little wiggle room for when the form is being submitted close to the end of the timeout
 */
const GRACE_PERIOD_MS = 3_000;

export default function Timeout({ sessionTtl, sessionTimeoutUrl }: TimeoutProps) {
  const router = useRouter();

  useEffect(() => {
    const navigate = () => router.replace(sessionTimeoutUrl);

    const delay = Math.min(Math.max(sessionTtl + GRACE_PERIOD_MS, SET_TIMEOUT_DELAY_MIN), SET_TIMEOUT_DELAY_MAX);

    const timeoutId = window.setTimeout(navigate, delay);

    return () => window.clearTimeout(timeoutId);
  }, [router, sessionTimeoutUrl, sessionTtl]);

  return undefined;
}
