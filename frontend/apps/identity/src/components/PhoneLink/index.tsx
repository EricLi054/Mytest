"use client";

import { logCustomEvent } from "#utils/analyticsTagging";
import { RAC_DEFAULT_HELP_NUMBER_DISPLAY_FORMAT, RAC_REGISTRATION_HELP_NUMBER_DISPLAY_FORMAT } from "#utils/constants";

import { StyledLink } from "@racwa/ui";

export type PhoneLinkProps = {
  displayNumber: string;
  analyticsEvent?: string;
};

export default function PhoneLink({ displayNumber, analyticsEvent }: PhoneLinkProps) {
  return (
    <StyledLink
      role="link"
      href={`tel:${displayNumber.replaceAll(" ", "")}`}
      rel="noreferrer noopener"
      target="_blank"
      noWrap
      onClick={analyticsEvent ? () => logCustomEvent(analyticsEvent) : undefined}
    >
      {displayNumber}
    </StyledLink>
  );
}

export function RacPhoneLink({ analyticsEvent }: Pick<PhoneLinkProps, "analyticsEvent">) {
  return <PhoneLink displayNumber={RAC_DEFAULT_HELP_NUMBER_DISPLAY_FORMAT} analyticsEvent={analyticsEvent} />;
}

export function RegistrationPhoneLink({ analyticsEvent }: Pick<PhoneLinkProps, "analyticsEvent">) {
  return (
    <PhoneLink
      displayNumber={RAC_REGISTRATION_HELP_NUMBER_DISPLAY_FORMAT}
      analyticsEvent={analyticsEvent ?? RAC_REGISTRATION_HELP_NUMBER_DISPLAY_FORMAT}
    />
  );
}
