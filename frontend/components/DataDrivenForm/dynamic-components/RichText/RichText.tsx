'use client'
import { useFieldApi } from '@data-driven-forms/react-form-renderer'
import BaseRichTextRenderer from '../BaseRichTextRenderer'

export const RacwaRichText = (props: any) => {
  const { richText } = useFieldApi(props)

  return (
    <BaseRichTextRenderer richText={richText} />
  )
}
