import { type ValidatorFunction } from '@data-driven-forms/react-form-renderer'
import { type ValidatorProps } from './ValidatorProps'

interface NameValidatorProps extends ValidatorProps {
  nameType?: 'firstName' | 'middleName' | 'lastName'
}

// validation rules https://rac-wa.atlassian.net/wiki/spaces/DDA4/pages/908133678/Name+fields
const nameValidator: (options?: object) => ValidatorFunction = (options?: NameValidatorProps) => (value: any, allValues?: object, meta?: any) => {
  if (value === undefined || value === null) return undefined // don't check until a value has been entered

  const defaultMessage = 'Invalid name'

  if (typeof value !== 'string') {
    return options?.message ?? defaultMessage
  }

  const firstNameRegEx = /^[a-zA-Z\-'() ]{1,50}$/ // DDA first name format
  const middleNameRegEx = /^[a-zA-Z\-'() ]{0,50}$/ // DDA middle name format
  const lastNameRegEx = /^[a-zA-Z\-'() ]{1,55}$/ // DDA last name format

  const regEx = options?.nameType === 'firstName' ? firstNameRegEx : options?.nameType === 'middleName' ? middleNameRegEx : lastNameRegEx

  if (!regEx.test(value)) { // remove spaces when checking regex
    return options?.message ?? defaultMessage
  }

  return undefined
}

export default nameValidator
