import addressValidator from './validators/addressValidator'
import dateOfBirthValidator from './validators/dateOfBirthValidator'
import emailValidator from './validators/emailValidator'
import genericPhoneValidator from './validators/genericPhoneValidator'
import nameValidator from './validators/nameValidator'
import noRemovalValidator from './validators/noRemovalValidator'
import racwaValidatorTypes from './validators/racwaValidatorTypes'

export const racwaValidationMapper = {
  [racwaValidatorTypes.ADDRESS_VALIDATION]: addressValidator,
  [racwaValidatorTypes.EMAIL]: emailValidator,
  [racwaValidatorTypes.GENERIC_PHONE]: genericPhoneValidator,
  [racwaValidatorTypes.NAME]: nameValidator,
  [racwaValidatorTypes.NO_REMOVAL]: noRemovalValidator,
  [racwaValidatorTypes.DATE_OF_BIRTH]: dateOfBirthValidator
}
