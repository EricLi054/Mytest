"use client";

import type { Document } from "@contentful/rich-text-types";
import type { ErrorPageSchema } from "#contentful/schema";
import type { z } from "zod";
import { useEffect } from "react";
import RichTextRenderer from "#components/RichTextRenderer/index";
import { logEvent, logPageView } from "#utils/analyticsTagging";

import type { FooterProps } from "@racwa/react-components";
import { ErrorPage } from "@racwa/ui";

import { getMyRacUrl } from "../../routing";

type ProductUpdateNotAllowedContainerProps = {
  racHomepageUrl: string;
  footerProps: FooterProps;
  contentfulData: z.infer<typeof ErrorPageSchema>;
};

export default function ProductUpdateNotAllowedContainer({
  racHomepageUrl,
  footerProps,
  contentfulData: {
    rac_stepperFormErrorPage: { heading, subheading, content },
  },
}: ProductUpdateNotAllowedContainerProps) {
  useEffect(logPageView, []);

  return (
    <ErrorPage heading={heading} navBreadcrumbProps={{ homeLink: racHomepageUrl }} footerProps={footerProps}>
      <ErrorPage.Subheading>{subheading}</ErrorPage.Subheading>
      <RichTextRenderer json={content.json as Document} paragraphProps={{ variant: "subtitle1" }} />
      <ErrorPage.Button href={getMyRacUrl(racHomepageUrl)} onClick={() => logEvent("Back to myRAC")}>
        Back to myRAC
      </ErrorPage.Button>
    </ErrorPage>
  );
}
