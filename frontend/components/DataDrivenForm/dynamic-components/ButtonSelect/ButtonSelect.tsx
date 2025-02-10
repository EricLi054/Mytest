'use client'
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api'
import { ToggleButton, ToggleButtonGroup, Grid } from '@mui/material'
import { RacwaFormControl } from '@racwa/react-components'
import { colors } from '@racwa/styles'
import { useGTMFormEvents } from '../../hooks/useGTMFormEvents'

interface SelectOption {
  label: string
  value: string
}

export const RacwaButtonSelect = (props: any) => {
  const { input, meta, options, label, helperText, required } =
    useFieldApi(props)
  const { logFormFieldTouched } = useGTMFormEvents(props)

  return (
    <div
      style={{
        width: '100%',
        marginLeft: '4px',
        marginBottom: '1rem'
      }}
    >
      <Grid container>
        <RacwaFormControl
          label={label}
          sublabel={helperText}
          error={meta.modified && meta.error !== undefined}
          helperText={meta.modified ? meta.error ?? undefined : undefined}
          required={required}
          margin='normal'
          passDownErrorProp={false}
          >
          <ToggleButtonGroup
              {...input}
              exclusive
              aria-label={label}
              sx={{
                border: meta?.error !== undefined ? `1px solid ${colors.brandDangerNew}` : ''
              }}>
            {options.map((opt: SelectOption) => (
              <ToggleButton value={opt.value} aria-label={opt.label} key={opt.value}
                onClick={logFormFieldTouched}>
                {opt.label || opt.value}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </RacwaFormControl>
      </Grid>
    </div>
  )
}
