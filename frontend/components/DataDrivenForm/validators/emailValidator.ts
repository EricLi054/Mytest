import { type ValidatorFunction } from '@data-driven-forms/react-form-renderer'
import { type ValidatorProps } from './ValidatorProps'

// validation rules https://rac-wa.atlassian.net/wiki/spaces/DDA4/pages/908166093/Other+Elements
const emailValidator: (options?: object) => ValidatorFunction = (options?: ValidatorProps) => (value: any, allValues?: object, meta?: any) => {
  if (value === undefined || value === null) return undefined // don't check until a value has been entered

  const defaultMessage = 'Invalid email address'

  if (typeof value !== 'string') {
    return options?.message ?? defaultMessage
  }

  const regEx = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/ // DDA email format

  if (!regEx.test(value)) { // remove spaces when checking regex
    return options?.message ?? defaultMessage
  }

  return undefined
}

export default emailValidator
