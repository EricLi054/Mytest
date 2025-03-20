import { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import { RichTextSchema } from "#graphql/sharedSchema/richTextSchema";
import { z } from "zod";

export const RawLandingPageSchema = z.object({
  items: z.array(
    z.object({
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
      content: z.object({
        __typename: z.string(),
        items: z.array(
          z.union([
            z.object({
              __typename: z.string(),
              sys: z.object({ id: z.string() }),
            }),
            z.object({
              __typename: z.string(),
              sys: z.object({ id: z.string() }),
              title: z.string(),
              direction: z.string(),
              width: z.string(),
              justifyContent: z.string(),
              alignItems: z.string(),
              contentItemsCollection: z.object({
                items: z.array(
                  z.object({
                    __typename: z.string(),
                    sys: z.object({ id: z.string() }),
                  }),
                ),
              }),
            }),
          ]),
        ),
      }),
    }),
  ),
});

export const RawStandardErrorPageSchema = z.object({
  items: z.array(
    z.object({
      __typename: z.string(),
      heading: z.string().nullable(),
      subHeading: z.string(),
      content: RichTextSchema,
    }),
  ),
});

export const RawSlugPageSchema = z.object({
  rac_landingPageCollection: RawLandingPageSchema.optional(),
  rac_standardErrorPageCollection: RawStandardErrorPageSchema.optional(),
});

export const RawMetaDataSchema = z.object({
  items: z.array(
    z.object({
      metaData: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),
  ),
});

export const RawSlugPageMetaDataSchema = z.object({
  rac_landingPageCollection: RawMetaDataSchema.optional(),
  rac_standardErrorPageCollection: RawMetaDataSchema.optional(),
});

export const RawErrorPageSchema = z.object({
  rac_errorPageCollection: z.object({
    items: z
      .array(
        z.object({
          title: z.string(),
          navigation: z.object({
            sys: z.object({ id: z.string() }),
          }),
          footer: z.object({
            sys: z.object({ id: z.string() }),
          }),
        }),
      )
      .nonempty(),
  }),
});
