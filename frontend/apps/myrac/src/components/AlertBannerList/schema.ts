import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { RichTextSchema } from "#graphql/sharedSchema/richTextSchema";
import { z } from "zod";

const IconType: z.ZodType<IconProp> = z.any();

export const BannerAlertSchema = z.object({
  title: z.string(),
  icon: IconType,
  bodyText: RichTextSchema,
});

export const BannerAlertCollectionSchema = z.object({
  rac_bannerAlertList: z.object({
    bannerAlertsCollection: z.object({
      items: z.array(BannerAlertSchema),
    }),
  }),
});
