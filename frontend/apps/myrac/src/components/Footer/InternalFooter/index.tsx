import type { ContentfulButtonSchema } from "#graphql/sharedSchema/buttonSchema";
import type { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import type { ReactNode } from "react";
import type { z } from "zod";

import type { SiteMapData } from "@racwa/react-components";

import FooterLinks from "../FooterLinks";
import FooterSearchBar from "../FooterSearchBar";
import { StyledFooterDescription, StyledFooterSiteMap } from "./styled";

export default function InternalFooter({
  logo,
  searchPlaceholderText,
  sitemapData,
  links,
  socialLinks,
  footerDescription,
}: {
  logo: string;
  searchPlaceholderText: string;
  sitemapData: SiteMapData[];
  links: z.infer<z.ZodArray<typeof ContentfulLinkSchema>>;
  socialLinks: z.infer<z.ZodArray<typeof ContentfulButtonSchema>>;
  footerDescription: ReactNode;
}) {
  return (
    <>
      <FooterSearchBar placeholderText={searchPlaceholderText} />
      <StyledFooterSiteMap
        footerDescription={
          <StyledFooterDescription container direction="column" gap={2}>
            {footerDescription}
          </StyledFooterDescription>
        }
        siteMapData={sitemapData}
      />
      <FooterLinks logoUrl={logo} links={links} socialLinks={socialLinks} />
    </>
  );
}
