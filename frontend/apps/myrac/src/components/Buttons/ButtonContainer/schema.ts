import type { Breakpoint } from "@mui/material";
import { z } from "zod";

const BreakpointType: z.ZodType<Breakpoint> = z.any();

export const ContentfulButtonContainerSchema = z.object({
  stackTogether: z.boolean(),
  itemsPerRow: z.number(),
  largeWidth: z.number(),
  columnBreakpoint: BreakpointType,
  gap: z.number(),
  buttons: z.object({
    items: z.array(
      z.object({
        sys: z.object({
          id: z.string(),
        }),
      }),
    ),
  }),
});
