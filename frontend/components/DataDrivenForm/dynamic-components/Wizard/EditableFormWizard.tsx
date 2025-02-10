'use client'
import { type Context, useContext } from 'react'
import WizardContext, {
  type WizardContextValue
} from '@data-driven-forms/react-form-renderer/wizard-context'
import { Button, Grid, Typography, styled, useMediaQuery } from '@mui/material'
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api'
import selectNext from '@data-driven-forms/common/wizard/select-next'
import { colors } from '@racwa/styles'
import { theme } from '@racwa/react-components'
import { logFieldTouched } from '@/utilities/analyticsTagging'
import { type Field } from '@data-driven-forms/react-form-renderer/common-types'
import { useMFAModalContext } from '@/components/ClientComponents/MFA/Context/MFAModalContext'

const StyledEditButton = styled(Button)(({ theme }) => ({
  padding: '5px 10px',
  minWidth: theme.spacing(6.5),
  [theme.breakpoints.up('sm')]: {
    minWidth: theme.spacing(12)
  }
}))

const StyledGrid = styled(Grid)(({ theme }) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  backgroundColor: colors.white,
  [theme.breakpoints.up('sm')]: {
    padding: `${theme.spacing(4)} ${theme.spacing(3)}`
  }
}))

export interface EditableFormWizardPage {
  name: string
  title: string
  requiresMfaToProceed?: boolean
  fields: Field[]
  nextStep?: string
}

interface EditableFormWizardContextValue extends WizardContextValue {
  currentStep: EditableFormWizardPage
}

const useEditableFormWizard = () =>
  useContext<EditableFormWizardContextValue>(
    WizardContext as unknown as Context<EditableFormWizardContextValue>
  )

export const EditableFormWizard = (props: any) => {
  const { formOptions, currentStep, handleNext, activeStepIndex } =
    useEditableFormWizard()
  const { title, shortTitle } = useFieldApi(props)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { openMFAModal } = useMFAModalContext()

  const handleMFATokenSuccess = async() => {
    // Get unmasked data and update schema
    handleNext(selectNext(currentStep.nextStep as string, formOptions.getState))
  }

  const handleEditButtonClick = async() => {
    logFieldTouched(`Edit - ${title as string}`)
    if (currentStep?.requiresMfaToProceed) {
      await openMFAModal(handleMFATokenSuccess)
    } else {
      handleNext(
        selectNext(currentStep.nextStep as string, formOptions.getState)
      )
    }
  }

  return (
    <StyledGrid container direction="column">
      <Grid item container sx={{ minHeight: '3rem' }}>
        <Grid item xs={9}>
          <Typography variant="h3">
            {isMobile && shortTitle ? shortTitle : title}
          </Typography>
        </Grid>
        {currentStep.nextStep && (
          <Grid
            item
            container
            xs={3}
            justifyContent="flex-end"
            visibility={activeStepIndex === 1 ? 'hidden' : 'visible'}
          >
            <StyledEditButton
              type="button"
              onClick={handleEditButtonClick}
              size={isMobile ? 'small' : 'medium'}
            >
              Edit
            </StyledEditButton>
          </Grid>
        )}
      </Grid>
      <Grid item xs>
        <Grid container direction="column" gap={1}>
          {formOptions.renderForm(currentStep.fields)}
        </Grid>
      </Grid>
    </StyledGrid>
  )
}
