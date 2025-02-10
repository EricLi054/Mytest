import { type ValidatorFunction } from '@data-driven-forms/react-form-renderer'
import { type ValidatorProps } from './ValidatorProps'

const addressValidator: (options?: object) => ValidatorFunction = (options?: ValidatorProps) => (value: any, allValues?: object, meta?: any) => {
  if (value === undefined || value === null) return undefined // don't check until an address has been entered

  if (typeof value !== 'object') return undefined // don't check until an address has been picked from the dropdown

  if (value.dpid === null || value.dpid === undefined) {
    return options?.message ?? 'Address could not be validated'
  }
}

export default addressValidator
