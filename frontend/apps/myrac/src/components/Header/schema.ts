import { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import { z } from "zod";

export const HeaderUserMenu = z.object({
  menuItems: z.object({
    items: z.array(ContentfulLinkSchema),
  }),
});

export const RawHeaderSchema = z.object({
  showBreadcrumbs: z.boolean(),
  links: z.object({
    items: z.array(ContentfulLinkSchema),
  }),
  mobileLinks: z.object({
    items: z.array(ContentfulLinkSchema),
  }),
  searchBar: z.object({
    placeholderText: z.string(),
  }),
  userMenu: HeaderUserMenu,
});
