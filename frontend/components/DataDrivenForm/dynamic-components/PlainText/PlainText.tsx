'use client'
import { useFieldApi } from '@data-driven-forms/react-form-renderer'
import { Typography } from '@mui/material'

export const RacwaPlainText = (props: any) => {
  const { label, variant, input, sx } = useFieldApi(props)

  return (
    <Typography
        {...input}
        variant={variant}
        sx={sx}>
            {label}
    </Typography>
  )
}
