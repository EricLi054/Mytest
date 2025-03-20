import type { z } from "zod";

import { ValidationOptionsSchema } from "../schema";

// validation rules https://rac-wa.atlassian.net/wiki/spaces/DDA4/pages/908133678/Name+fields
const mobileRegEx = /^((04))[0-9]{2}[0-9]{2}[0-9]{1}[0-9]{3}$/;
const landlineRegEx = /^(((0)(2|3|7|8)){0,1})[1-9]{2}[0-9]{2}[0-9]{4}$/;
const combinedRegEx = /^(((0)(2|4|3|7|8)){0,1})[0-9]{2}[0-9]{2}[0-9]{4}$/;

const genericPhoneValidator = (options?: object) => (value?: z.infer<z.ZodNullable<z.ZodString>>) => {
  if (!value) {
    return undefined;
  }

  const validatedOptions = ValidationOptionsSchema.safeParse(options);

  if (validatedOptions.success && validatedOptions.data.phoneType) {
    let regExToUse = null;

    switch (validatedOptions.data.phoneType.toLowerCase()) {
      case "mobile":
        regExToUse = mobileRegEx;
        break;
      case "landline":
        regExToUse = landlineRegEx;
        break;
      case "both":
        regExToUse = combinedRegEx;
        break;
    }

    if (!regExToUse) {
      console.error("Unsupported phoneType supplied to genericPhoneValidator.");
      return undefined;
    }

    if (!regExToUse.test(value.replace(/\s/g, ""))) {
      return validatedOptions.data.message;
    }
  }

  return undefined;
};

export default genericPhoneValidator;
