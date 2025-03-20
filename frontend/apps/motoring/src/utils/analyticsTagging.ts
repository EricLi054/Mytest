"use client";

import { event, fieldTouched, gtm, virtualPageView } from "@racwa/analytics";

export const logEvent = (description: string) => {
  gtm(
    event(description, {
      url: window.location.pathname,
      title: document.title,
    }),
  );
};

export const logFieldTouched = (description: string) => {
  gtm(
    fieldTouched(description, {
      url: window.location.pathname,
      title: document.title,
    }),
  );
};

export const logPageView = (title?: string) => {
  gtm(
    virtualPageView({
      url: window.location.pathname,
      title: title ?? document.title,
    }),
  );
};

export const logFieldCleared = (label: string) => {
  const description = `Field empty error - ${label}`;
  gtm(
    event(description, {
      url: window.location.pathname,
      title: document.title,
    }),
  );
};
