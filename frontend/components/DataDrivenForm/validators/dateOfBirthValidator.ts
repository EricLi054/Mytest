import { type ValidatorFunction } from '@data-driven-forms/react-form-renderer'
import { type ValidatorProps } from './ValidatorProps'

interface DateOfBirthValidatorProps extends ValidatorProps {
  ageOutOfRangeMessage?: string
  maxAge?: number
  minAge?: number
}

const dateOfBirthValidator: (options?: object) => ValidatorFunction = (options?: DateOfBirthValidatorProps) => (value: any, allValues?: object, meta?: any) => {
  if (value === undefined || value === null) return undefined // don't check until a value has been entered

  if (typeof value !== 'object' || !isValidDate(value)) {
    return options?.message ?? 'Invalid date of birth'
  }

  // Calculate age
  const dob = new Date(value)
  const currentYear = new Date().getFullYear()
  const minValidYear = currentYear - (options?.maxAge ?? 100)
  const maxValidYear = currentYear - (options?.minAge ?? 16)

  // Check if the date of birth falls within the allowed range
  if (!isDateWithinRange(dob, minValidYear, maxValidYear)) {
    return options?.ageOutOfRangeMessage ?? 'Your age must be within the valid range'
  }

  return undefined
}

// Check if the value is a valid date
const isValidDate = (date: Date) => {
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  if (isNaN(day) || isNaN(month) || isNaN(year)) return false
  if (year < 1000) return false
  return true
}

// Function to check if a date falls within a specified range
const isDateWithinRange = (date: Date, minYear: number, maxYear: number) => {
  const today = new Date()
  const dateYear = date.getFullYear()
  const dateMonth = date.getMonth()
  const dateDate = date.getDate()
  const currentMonth = today.getMonth()
  const currentDate = today.getDate()
  return (
    (dateYear > minYear ||
      (dateYear === minYear &&
        dateMonth > currentMonth) ||
      (dateYear === minYear &&
        dateMonth === currentMonth &&
        dateDate >= currentDate)) &&
    (dateYear < maxYear ||
      (dateYear === maxYear &&
        dateMonth < currentMonth) ||
      (dateYear === maxYear &&
        dateMonth === currentMonth &&
        dateDate <= currentDate))
  )
}

export default dateOfBirthValidator
