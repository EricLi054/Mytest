"use client";

import { event, fieldTouched, gtm } from "@racwa/analytics";

const getPageParameters = () => ({
  url: window.location.pathname,
  title: document.title,
});

export const logCustomEvent = (description: string) => {
  gtm(event(description, getPageParameters()));
};

export const logFieldTouched = (description: string) => {
  gtm(fieldTouched(description, getPageParameters()));
};
