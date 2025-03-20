"use client";

import { event, fieldTouched, gtm, navClick, virtualPageView } from "@racwa/analytics";

export const logNavClick = (description: string) => {
  if (typeof window === "undefined") return;
  gtm(
    navClick(description, {
      url: window.location.pathname,
      title: document.title,
    }),
  );
};

export const logEvent = (description: string) => {
  if (typeof window === "undefined") return;
  gtm(
    event(description, {
      url: window.location.pathname,
      title: document.title,
    }),
  );
};

export const logFieldTouched = (description: string) => {
  if (typeof window === "undefined") return;
  gtm(
    fieldTouched(description, {
      url: window.location.pathname,
      title: document.title,
    }),
  );
};

export const logPageView = () => {
  if (typeof window === "undefined") return;
  gtm(
    virtualPageView({
      url: window.location.pathname,
      title: document.title,
    }),
  );
};
