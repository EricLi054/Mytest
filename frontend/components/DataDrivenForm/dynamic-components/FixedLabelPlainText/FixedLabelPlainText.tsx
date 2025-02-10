'use client'
import { useFieldApi } from '@data-driven-forms/react-form-renderer'
import { Grid, Typography } from '@mui/material'

export const RacwaFixedLabelPlainText = (props: any) => {
  const { label, fixedLabelWidth, variant, input, sx } = useFieldApi(props)

  let fixedLabel
  let rest = label
  if (typeof label === 'string' && fixedLabelWidth) {
    const splitLabel = label.split(' ')
    fixedLabel = splitLabel[0]
    rest = splitLabel.slice(1).join(' ')
  }

  return (
    <Grid container>
      {
        fixedLabel &&
        <Typography
          width={fixedLabelWidth?.includes('{') ? JSON.parse(fixedLabelWidth) : fixedLabelWidth}
          variant={variant}
          sx={sx}>
              {fixedLabel}
        </Typography>
      }
      <Typography
          {...input}
          variant={variant}
          sx={sx}>
              {rest}
      </Typography>
    </Grid>
  )
}
