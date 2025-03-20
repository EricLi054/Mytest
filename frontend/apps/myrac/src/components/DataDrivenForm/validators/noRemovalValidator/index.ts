import type { z } from "zod";

import { ValidationMetaSchema, ValidationOptionsSchema } from "../schema";

const noRemovalValidator =
  (options?: object) => (value?: z.infer<z.ZodNullable<z.ZodString>>, _?: object, meta?: object) => {
    const validatedOptions = ValidationOptionsSchema.safeParse(options);
    const validatedMeta = ValidationMetaSchema.safeParse(meta);

    if (validatedOptions.success && validatedMeta.success) {
      if (validatedMeta.data.initial === undefined || validatedMeta.data.initial === null) return undefined;

      if (value === null || value === undefined || value.length === 0) {
        return validatedOptions.data.message;
      }
    }

    return undefined;
  };

export default noRemovalValidator;
