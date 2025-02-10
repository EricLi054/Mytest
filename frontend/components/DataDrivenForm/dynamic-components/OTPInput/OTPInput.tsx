'use client'
import useFieldApi, {
  type UseFieldApiConfig
} from '@data-driven-forms/react-form-renderer/use-field-api'
import { Box } from '@mui/material'
import { RacwaOtpInput } from '@racwa/react-components'

export const RacwaOTPInput = (props: UseFieldApiConfig) => {
  const { input, required, meta, disableInputOnErrorMessage } =
    useFieldApi(props)

  const validationError: string =
    meta.touched && !meta.modifiedSinceLastSubmit && meta.error
  const serverSubmitError = !meta.modifiedSinceLastSubmit && meta.submitError
  const isDisabled =
    meta.submitError !== undefined &&
    meta.submitError === disableInputOnErrorMessage

  return (
    <Box sx={{ width: '100%' }}>
      <RacwaOtpInput
        length={6}
        value={input.value}
        onChange={input.onChange}
        required={required || true}
        error={validationError || serverSubmitError}
        disabled={isDisabled}
      />
    </Box>
  )
}
