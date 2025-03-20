import { z } from "zod";

export const ContentfulCloudinaryImageSchema = z.array(
  z.object({
    secureUrl: z.string(),
  }),
);
