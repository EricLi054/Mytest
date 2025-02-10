import { type ValidatorFunction } from '@data-driven-forms/react-form-renderer'
import { type ValidatorProps } from './ValidatorProps'

const noRemovalValidator: (options?: object) => ValidatorFunction = (options?: ValidatorProps) => (value: any, allValues?: object, meta?: any) => {
  if (meta?.initial === undefined || meta?.initial === null) return undefined

  if (value === null || value === undefined || value.length === 0) {
    return options?.message ?? 'You cannot remove this item'
  }
}

export default noRemovalValidator
