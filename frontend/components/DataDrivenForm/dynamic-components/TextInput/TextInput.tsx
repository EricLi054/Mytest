'use client'
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api'
import { RacwaTextInput } from '@racwa/react-components'
import { useState } from 'react'
import { useGTMFormEvents } from '../../hooks/useGTMFormEvents'

export const FormTextInput = (props: any) => {
  const { input, label, required, helperText, tooltipTitle, tooltipText, placeholder, meta } = useFieldApi(props)
  const { logFormFieldTouched, logFormFieldValidation } = useGTMFormEvents(props)
  const [open, setOpen] = useState(false)

  const tooltipProps =
    tooltipTitle || tooltipText
      ? {
          open,
          title: tooltipTitle,
          message: tooltipText,
          onClickClose: () => { setOpen(false) },
          onClick: () => { setOpen(true) }
        }
      : undefined

  return (
    <>
      <RacwaTextInput
        {...input}
        label={label}
        required={required}
        sublabel={helperText}
        error={meta.modified && meta.error !== undefined}
        helperText={meta.modified ? meta?.error ?? undefined : undefined}
        tooltipProps={tooltipProps}
        placeholder={placeholder}
        onBlur={logFormFieldValidation}
        onFocus={logFormFieldTouched}
      />
    </>
  )
}
