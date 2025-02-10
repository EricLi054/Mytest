'use client'
import { useFieldApi } from '@data-driven-forms/react-form-renderer'
import { RacwaDatePicker } from '@racwa/react-components'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useGTMFormEvents } from '../../hooks/useGTMFormEvents'
import { logFieldTouched } from '@/utilities/analyticsTagging'

export const DatePicker = (props: any) => {
  const { input, label, required, helperText, meta } = useFieldApi(props)
  const { logFormFieldTouched, logFormFieldValidation } = useGTMFormEvents(props)

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <RacwaDatePicker
        {...input}
        value={typeof input.value === 'string' ? null : input.value}
        label={label as string + (required ? ' *' : '')} // TODO: The required prop needs to be passed in the RacwaDatePicker
        sublabel={helperText}
        optional={!required}
        error={meta.touched && meta.error !== undefined}
        helperText={(meta.touched) ? meta.error ?? undefined : undefined}
        fullWidth
        onOpen={() => { logFieldTouched(`${label as string} - Calendar Icon`) }}
        onClose={() => {
          input.onBlur()
          logFormFieldValidation()
        }}
        onChange={(value) => {
          input.onChange(value)
        }}
        slotProps={{
          textField: {
            onFocus: logFormFieldTouched,
            onBlur: () => {
              input.onBlur() // Proxy onBlur to underyling input
              logFormFieldValidation()
            },
            onChange: input.onChange

          }
        }}

      />
    </LocalizationProvider>
  )
}
