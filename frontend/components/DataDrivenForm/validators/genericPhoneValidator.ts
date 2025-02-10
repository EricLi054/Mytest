import { type ValidatorFunction } from '@data-driven-forms/react-form-renderer'
import { type ValidatorProps } from './ValidatorProps'

interface LandlineValidatorProps extends ValidatorProps {
  phoneType?: string
}

// validation rules https://rac-wa.atlassian.net/wiki/spaces/DDA4/pages/908166093/Other+Elements
const genericPhoneValidator: (options?: object) => ValidatorFunction = (options?: LandlineValidatorProps) => (value: any, allValues?: object, meta?: any) => {
  if (value === undefined || value === null) return undefined // don't check until a value has been entered

  const defaultMessage = 'Invalid phone number'

  if (typeof value !== 'string') {
    return options?.message ?? defaultMessage
  }

  let regEx

  switch (options?.phoneType?.toLowerCase()) {
    case 'mobile':
      regEx = /^((04))[0-9]{2}[0-9]{2}[0-9]{1}[0-9]{3}$/ // DDA mobile number format
      break
    case 'landline':
      regEx = /^(((0)(2|3|7|8)){0,1})[1-9]{2}[0-9]{2}[0-9]{4}$/ // DDA landline only number format
      break
    default:
      regEx = /^(((0)(2|4|3|7|8)){0,1})[0-9]{2}[0-9]{2}[0-9]{4}$/ // DDA mobile and landline number format
      break
  }

  if (!regEx.test(value.replace(/\s/g, ''))) { // remove spaces when checking regex
    return options?.message ?? defaultMessage
  }

  return undefined
}

export default genericPhoneValidator
