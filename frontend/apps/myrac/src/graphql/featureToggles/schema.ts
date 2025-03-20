import { z } from "zod";

export const FeatureToggleSchema = z.object({
  featureToggles: z.array(
    z.object({
      key: z.string(),
      value: z.boolean(),
    }),
  ),
});
