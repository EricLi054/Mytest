"use client";

import { StyledLink } from "#styled/StyledLink";

import { event, gtm } from "@racwa/analytics";

export type PhoneLinkProps = {
  displayNumber: string;
  analyticsEvent?: string;
  id?: string;
};

/**
 * TODO - DED-1295 - Add in this package or to UI package? Is it a good idea to make this package dependent on the UI package?
 */
export function PhoneLink({ displayNumber, analyticsEvent, id = "phone-link" }: PhoneLinkProps) {
  // Need to handle href like this to resolve issue where component was erring at the `replaceAll` call
  const href = displayNumber ? `tel:${displayNumber.replaceAll(" ", "")}` : undefined;
  return (
    <StyledLink
      id={id}
      role="link"
      href={href}
      rel="noreferrer noopener"
      target="_blank"
      noWrap
      onClick={analyticsEvent ? () => gtm(event(analyticsEvent)) : undefined}
    >
      {displayNumber}
    </StyledLink>
  );
}
