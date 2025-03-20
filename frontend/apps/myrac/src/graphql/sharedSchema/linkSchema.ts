import { z } from "zod";

export const ContentfulLinkSchema = z.object({
  __typename: z.string().optional(),
  longLinkText: z.string(),
  shortLinkText: z.string().nullable().optional(),
  linkUrl: z.string().nullable().optional(),
  linkImage: z.any().nullable().optional(),
  googleAnalyticsDescription: z.string().nullable().optional(),
});
