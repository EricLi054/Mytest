import type { ContentfulButtonSchema } from "#graphql/sharedSchema/buttonSchema";
import type { z } from "zod";

import type { RawBannerSchema } from "./schema";

export type BannerLinkCollection = z.infer<z.ZodArray<typeof ContentfulButtonSchema>>;

export type BannerImages = z.infer<typeof RawBannerSchema>["bannerImage"];
