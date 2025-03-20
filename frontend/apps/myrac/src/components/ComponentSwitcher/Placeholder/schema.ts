import { ContentfulCloudinaryImageSchema } from "#graphql/sharedSchema/cloudinaryImageSchema";
import { RichTextSchema } from "#graphql/sharedSchema/richTextSchema";
import { z } from "zod";

export const EngineeredContentSchema = z.object({
  contentId: z.string(),
  stringContent: z.string().nullable().optional(),
  iconContent: z.any().nullable().optional(),
  richTextContent: RichTextSchema.nullable(),
  imageContent: ContentfulCloudinaryImageSchema.nullable().optional(),
});

export const EngineeredContentCollectionSchema = z.object({
  items: z.array(EngineeredContentSchema),
});

export const PlaceholderSchema = z.object({
  __typename: z.string(),
  placeholderType: z.string(),
  engineeredContentCollection: EngineeredContentCollectionSchema,
});
