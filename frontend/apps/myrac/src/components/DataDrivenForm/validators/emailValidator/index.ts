import type { z } from "zod";

import { ValidationOptionsSchema } from "../schema";

// validation rules https://rac-wa.atlassian.net/wiki/spaces/DDA4/pages/908166093/Other+Elements
// eslint-disable-next-line security/detect-unsafe-regex
const regEx = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

const emailValidator = (options?: object) => (value?: z.infer<z.ZodNullable<z.ZodString>>) => {
  if (!value) {
    return undefined;
  }

  const validatedOptions = ValidationOptionsSchema.safeParse(options);

  if (validatedOptions.success) {
    if (!regEx.test(value)) {
      return validatedOptions.data.message;
    }
  }

  return undefined;
};

export default emailValidator;
