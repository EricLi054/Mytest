import { useFormApi } from '@data-driven-forms/react-form-renderer'
import { type MFAChannel, MFAState, MFAVerificationState } from '../Types/MFAEnums'
import { getMfaChannelString, getMFAStepString, type MFAModalContentModel } from '../Content/mfaModalContent'
import { RacwaNotifyButton } from '@racwa/react-components'
import DoneIcon from '@mui/icons-material/Done'
import { Box } from '@mui/material'
import { useMFAModalContext } from '../Context/MFAModalContext'
import { MFAModalFooter } from '../Content/MFAModalFooter'
import { useEffect } from 'react'
import { logEvent } from '@/utilities/analyticsTagging'

type ButtonStates = React.ComponentProps<
  typeof RacwaNotifyButton
>['buttonStates']

const getButtonStates = (id: string, content: MFAModalContentModel) => [
  {
    children: content.verifyCodeButtonText,
    color: 'primary',
    fullWidth: true,
    type: 'submit',
    id: `${id}-verify-initial`,
    key: `${id}-verify-initial`,
    'data-testid': 'verify-initial'
  },
  {
    children: 'Verifying',
    color: 'secondary',
    disabled: true,
    fullWidth: true,
    id: `${id}-verify-verifying`,
    key: `${id}-verify-verifying`,
    'data-testid': 'verify-verifying'
  },
  {
    children: content.verifiedCodeButtonText,
    color: 'secondary',
    fullWidth: true,
    startIcon: <DoneIcon fontSize="large" color="inherit" />,
    id: `${id}-verify-verified`,
    key: `${id}-verify-verified`,
    'data-testid': 'verify-success'
  },
  {
    children: content.verifyCodeButtonText,
    color: 'primary',
    fullWidth: true,
    id: `${id}-verify-fail`,
    key: `${id}-verify-fail`,
    disabled: true,
    'data-testid': 'verify-fail'
  }
]

export interface MFAFormTemplateProps {
  schema: any
  formFields: any
  verificationState: MFAVerificationState
  handleMFAChangeChannel: () => void
  handleMFAResendCodeClick: () => void
}

export const MFAFormTemplate: React.FC<MFAFormTemplateProps> = ({
  formFields,
  verificationState,
  handleMFAChangeChannel,
  handleMFAResendCodeClick
}) => {
  const { handleSubmit, getFieldState } = useFormApi()
  const { contentDefinition: content, channel, isPhoneOnly } = useMFAModalContext()
  if (!content) throw new Error('Content definition not found')

  const otpField = getFieldState('OTP')
  useEffect(() => {
    if (otpField?.value?.length === 1) {
      logEvent(`${getMfaChannelString(channel as MFAChannel, isPhoneOnly)} - ${getMFAStepString(MFAState.verifyCode, MFAVerificationState.initial)} - ${content.verifyCodeEntryAnalyticsText}`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpField])

  return (
    <form noValidate data-testid="mfa-otp-form">
      <Box mb={3}> {formFields}</Box>
      <Box mb={3}>
        <RacwaNotifyButton
          activeState={verificationState}
          onClick={handleSubmit}
          buttonStates={
            getButtonStates('otp-verify-button', content) as ButtonStates
          }
        />
      </Box>
      <MFAModalFooter
        handleMFAChangeChannel={handleMFAChangeChannel}
        handleMFAResendCodeClick={handleMFAResendCodeClick}
      />
    </form>
  )
}
