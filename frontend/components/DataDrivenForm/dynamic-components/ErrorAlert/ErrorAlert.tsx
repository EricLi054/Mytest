'use client'
import { useFormApi } from '@data-driven-forms/react-form-renderer'
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api'
import { RacwaCardNotification } from '@racwa/react-components'
import BaseRichTextRenderer from '../BaseRichTextRenderer'

export const RacwaErrorAlert = (props: any) => {
  const { label, richText, helperText, errorType } = useFieldApi(props)
  const { getState } = useFormApi()

  const errorTypes = getState().submitErrors?.data?.errors?.map((error: any) => error.extensions?.type?.toLowerCase())

  if (getState().hasSubmitErrors && errorTypes?.includes(errorType.toLowerCase())) {
    return (
      <RacwaCardNotification style={{ width: '100%', marginBottom: '2rem', marginTop: '1rem' }} title={richText ? <BaseRichTextRenderer richText={richText} /> : label} severity="error">
        {helperText}
      </RacwaCardNotification>
    )
  }

  return null
}
