import { ContentfulButtonSchema } from "#graphql/sharedSchema/buttonSchema";
import { ContentfulCloudinaryImageSchema } from "#graphql/sharedSchema/cloudinaryImageSchema";
import { RichTextSchema } from "#graphql/sharedSchema/richTextSchema";
import { z } from "zod";

export const RawBannerSchema = z.object({
  heading: RichTextSchema,
  bannerImage: ContentfulCloudinaryImageSchema.nonempty(),
  bannerLinksCollection: z.object({
    items: z.array(ContentfulButtonSchema),
  }),
});
