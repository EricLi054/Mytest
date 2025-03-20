"use client";

import type { ContentfulButtonSchema } from "#graphql/sharedSchema/buttonSchema";
import type { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import type { z } from "zod";

import { StyledDataDrivenRacwaFooter } from "./styled";
import { generateFooterLinks, generateSocialLinks } from "./util";

export default function FooterLinks({
  logoUrl,
  links,
  socialLinks,
}: {
  logoUrl: string;
  links: z.infer<z.ZodArray<typeof ContentfulLinkSchema>>;
  socialLinks: z.infer<z.ZodArray<typeof ContentfulButtonSchema>>;
}) {
  return (
    <StyledDataDrivenRacwaFooter
      logo={logoUrl}
      footerLinks={generateFooterLinks(links)}
      socialLinks={generateSocialLinks(socialLinks)}
    />
  );
}
