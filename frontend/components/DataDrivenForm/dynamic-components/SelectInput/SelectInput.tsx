'use client'
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api'
import { MenuItem } from '@mui/material'
import { RacwaSelect } from '@racwa/react-components'
import { useGTMFormEvents } from '../../hooks/useGTMFormEvents'

interface SelectOption {
  label: string
  value: string
}

export const FormSelectInput = (props: any) => {
  const { input, helperText, label, required, meta, options } = useFieldApi(props)
  const { logFormFieldTouched } = useGTMFormEvents(props)

  return (
    <>
      <RacwaSelect
          {...input}
          label={label}
          sublabel={helperText}
          error={meta.modified && meta.error !== undefined}
          helperText={meta.modified ? meta.error ?? undefined : undefined}
          required={required}
          onClick={logFormFieldTouched}
        >
        {options.map((option: SelectOption) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label || option.value }
          </MenuItem>
        ))}
      </RacwaSelect>
    </>
  )
}
