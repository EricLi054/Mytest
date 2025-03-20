"use client";

import type { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import type { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logEvent } from "#utils/analyticsTagging";
import { errorPages } from "#utils/errorPages";

import { StyledNextLink } from "../../StyledNextLink";

export const InternalContentfulLink = ({ longLinkText, linkUrl }: z.infer<typeof ContentfulLinkSchema>) => {
  const router = useRouter();
  try {
    const searchParams = useSearchParams();
    const url = searchParams.get("return_url");

    if (!url) {
      return (
        <StyledNextLink
          href={linkUrl ?? ""}
          sx={{ fontSize: 14 }}
          onClick={() => {
            logEvent(`Back to ${longLinkText}`);
          }}
        >
          <FontAwesomeIcon icon="chevron-left" style={{ marginRight: 4, fontSize: 12 }} />
          {longLinkText}
        </StyledNextLink>
      );
    }

    const returnUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    const href = new URL(returnUrl).href;

    return (
      <StyledNextLink
        href={href}
        sx={{ fontSize: 16 }}
        onClick={() => {
          logEvent(longLinkText);
        }}
      >
        {longLinkText}
      </StyledNextLink>
    );
  } catch {
    router.push(errorPages.somethingWentWrong);
  }
};
