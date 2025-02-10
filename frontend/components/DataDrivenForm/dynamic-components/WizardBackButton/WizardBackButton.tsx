'use client'
import { useContext } from 'react'
import WizardContext from '@data-driven-forms/react-form-renderer/wizard-context'
import { Button, styled } from '@mui/material'
import { useFieldApi } from '@data-driven-forms/react-form-renderer'
import { logEvent } from '@/utilities/analyticsTagging'

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1)
}))

export const WizardBackButton = (props: any) => {
  const { handlePrev } = useContext(WizardContext)
  const { label } = useFieldApi(props)

  return (
    <>
      <StyledButton
      type="button"
      onClick={() => {
        handlePrev()
        logEvent(`${label as string}`)
      }}>
        {label}
      </StyledButton>
    </>
  )
}
