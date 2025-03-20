import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import type { ButtonProps } from "@mui/material";
import { z } from "zod";

import { ContentfulCloudinaryImageSchema } from "./cloudinaryImageSchema";

const IconType: z.ZodType<IconProp> = z.any();
const ColourType: z.ZodType<ButtonProps["color"]> = z.any();

export const ContentfulButtonSchema = z.object({
  __typename: z.string().optional(),
  longText: z.string(),
  shortText: z.string().nullable().optional(),
  image: ContentfulCloudinaryImageSchema.nullable().optional(),
  link: z.string(),
  icon: IconType.nullable().optional(),
  colour: ColourType.nullable().optional(),
  border: z.boolean().nullable().optional(),
  logoHoverColour: z.string().nullable().optional(),
  variant: z.string().optional(),
});
