'use client'
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api'
import { RacwaCardNotification } from '@racwa/react-components'
import BaseRichTextRenderer from '../BaseRichTextRenderer'

export const RacwaInfoAlert = (props: any) => {
  const { label, richText, helperText } = useFieldApi(props)

  return (
    <RacwaCardNotification style={{ width: '100%', marginBottom: '1rem' }} title={richText ? <BaseRichTextRenderer richText={richText} /> : label} severity="info">
      {helperText}
    </RacwaCardNotification>
  )
}
