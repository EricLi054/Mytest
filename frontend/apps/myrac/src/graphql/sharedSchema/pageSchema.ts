import { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import { RichTextSchema } from "#graphql/sharedSchema/richTextSchema";
import { z } from "zod";

export const PageContentItemSchema = z.object({
  __typename: z.string(),
  sys: z.object({ id: z.string() }),
});

export const PageContentSchema = z.object({
  __typename: z.string(),
  items: z.array(PageContentItemSchema).optional(),
});

export const LandingPageSchema = z.object({
  __typename: z.string(),
  title: z.string(),
  enableVwo: z.boolean(),
  breadcrumbs: z.object({
    items: z.array(ContentfulLinkSchema),
  }),
  bannerAlerts: z
    .object({
      __typename: z.string(),
      sys: z.object({ id: z.string() }),
    })
    .nullable(),
  navigation: z.object({
    __typename: z.string(),
    sys: z.object({ id: z.string() }),
  }),
  banner: z
    .object({
      __typename: z.string(),
      sys: z.object({ id: z.string() }),
    })
    .nullable(),
  footer: z.object({
    __typename: z.string(),
    sys: z.object({ id: z.string() }),
  }),
  content: PageContentSchema.optional(),
});

export const ErrorPageSchema = z.object({
  __typename: z.string(),
  heading: z.string().nullable(),
  subHeading: z.string().nullable(),
  content: RichTextSchema,
});

export const SlugPageSchema = z.object({
  landingPage: LandingPageSchema.optional(),
  standardErrorPage: ErrorPageSchema.optional(),
});

export const MetaDataSchema = z.object({
  metaData: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const SlugPageMetaDataSchema = z.object({
  landingPage: MetaDataSchema.optional(),
  standardErrorPage: MetaDataSchema.optional(),
});
