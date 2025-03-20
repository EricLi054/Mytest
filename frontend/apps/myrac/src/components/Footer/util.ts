import type { z } from "zod";

import type { FooterSitemapSchema } from "./schema";

export const generateSitemap = (sitemapData: z.infer<z.ZodArray<typeof FooterSitemapSchema>>) => {
  return sitemapData.map((footerSection) => {
    return {
      title: footerSection.parentLink.longLinkText,
      link: footerSection.parentLink.linkUrl ?? "",
      children: footerSection.links.items.map((link) => {
        return {
          title: link.longLinkText,
          link: link.linkUrl ?? "",
        };
      }),
    };
  });
};
