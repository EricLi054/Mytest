import { validatorTypes } from "../validators";
import addressValidator from "../validators/addressValidator";
import emailValidator from "../validators/emailValidator";
import genericPhoneValidator from "../validators/genericPhoneValidator";
import nameValidator from "../validators/nameValidator";
import noRemovalValidator from "../validators/noRemovalValidator";

export const racwaValidationMapper = {
  [validatorTypes.ADDRESS_VALIDATION]: addressValidator,
  [validatorTypes.EMAIL]: emailValidator,
  [validatorTypes.GENERIC_PHONE]: genericPhoneValidator,
  [validatorTypes.NAME]: nameValidator,
  [validatorTypes.NO_REMOVAL]: noRemovalValidator,
};
