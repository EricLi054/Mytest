import type { IconName } from "@fortawesome/fontawesome-svg-core";
import type { ContentfulButtonSchema } from "#graphql/sharedSchema/buttonSchema";
import type { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import type { z } from "zod";
import { findIconDefinition } from "@fortawesome/fontawesome-svg-core";

export const generateFooterLinks = (links: z.infer<z.ZodArray<typeof ContentfulLinkSchema>>) => {
  return links.map((link) => {
    return {
      label: link.longLinkText,
      link: link.linkUrl ?? "",
    };
  });
};

export const generateSocialLinks = (links: z.infer<z.ZodArray<typeof ContentfulButtonSchema>>) => {
  return links.map((link) => {
    return {
      title: link.longText,
      link: link.link,
      logo: findIconDefinition({ prefix: "fab", iconName: link.icon as IconName }),
      logoHoverColor: link.logoHoverColour ?? "",
    };
  });
};
