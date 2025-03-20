import type { clientEnvSchema } from "#env/client";
import type { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import type { z } from "zod";
import { logNavClick } from "#utils/analyticsTagging";

import { StyledMenuLink, StyledMenuTitle } from "./styled";

export const getTitleLink = (links: z.infer<z.ZodArray<typeof ContentfulLinkSchema>>) => {
  const firstLink = links[0];

  if (firstLink) {
    return (
      <StyledMenuTitle
        href={firstLink.linkUrl ?? ""}
        onClick={() => {
          if (firstLink.googleAnalyticsDescription) {
            logNavClick(firstLink.googleAnalyticsDescription);
          }
        }}
      >
        {firstLink.longLinkText}
      </StyledMenuTitle>
    );
  }

  return null;
};

export const getMenuLinks = (
  links: z.infer<z.ZodArray<typeof ContentfulLinkSchema>>,
  env: z.infer<typeof clientEnvSchema>,
) => {
  return links.slice(1).map((item) => {
    item.linkUrl = item.linkUrl?.replace("{{onlineShopUrl}}", env.ONLINE_SHOP_URL).replace("{{b2cUrl}}", env.B2C_URL);
    return (
      <StyledMenuLink
        key={item.linkUrl}
        href={item.linkUrl ?? ""}
        onClick={() => {
          if (item.googleAnalyticsDescription) {
            logNavClick(item.googleAnalyticsDescription);
          }
        }}
      >
        {item.longLinkText}
      </StyledMenuLink>
    );
  });
};
