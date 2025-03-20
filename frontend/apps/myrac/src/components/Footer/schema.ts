import { ContentfulButtonSchema } from "#graphql/sharedSchema/buttonSchema";
import { ContentfulCloudinaryImageSchema } from "#graphql/sharedSchema/cloudinaryImageSchema";
import { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import { RichTextJsonSchema } from "#graphql/sharedSchema/richTextSchema";
import { z } from "zod";

export const FooterSitemapSchema = z.object({
  parentLink: ContentfulLinkSchema,
  links: z.object({ items: z.array(ContentfulLinkSchema) }),
});

export const RawFooterSchema = z.object({
  searchBar: z.object({
    placeholderText: z.string(),
  }),
  sitemap: z.object({
    items: z.array(FooterSitemapSchema),
  }),
  endText: z.object({
    json: RichTextJsonSchema,
  }),
  logo: ContentfulCloudinaryImageSchema.nonempty(),
  links: z.object({
    items: z.array(ContentfulLinkSchema),
  }),
  socialLinks: z.object({
    items: z.array(ContentfulButtonSchema),
  }),
});
