'use client'
import { Typography } from '@mui/material'
import { MFAChannel, MFAVerificationState } from '../Types/MFAEnums'
import { MFAForm } from '../Form/MFAForm'
import { useMFAModalContext } from '../Context/MFAModalContext'

export interface MFAEnterVerificationCodeModalContentProps {
  id: string
  verifyCodeClick: (otpCode: string) => Promise<any>
  mfaVerificationState?: MFAVerificationState
  handleMFAChangeChannel: () => void
  handleMFAResendCodeClick: () => void
}

export const MFAEnterVerificationCodeModalContent: React.FC<
MFAEnterVerificationCodeModalContentProps
> = ({
  verifyCodeClick,
  mfaVerificationState = MFAVerificationState.initial,
  handleMFAChangeChannel,
  handleMFAResendCodeClick
}) => {
  const { contentDefinition, channel } = useMFAModalContext()

  if (!contentDefinition) throw new Error('Content definition not found')

  return (
    <>
      <Typography variant="body1">
        {channel === MFAChannel.sms
          ? contentDefinition.verifyCodeSMSBodyText
          : contentDefinition.verifyCodePhoneBodyText}
      </Typography>
      <MFAForm
        handleMFAChangeChannel={handleMFAChangeChannel}
        handleMFAResendCodeClick={handleMFAResendCodeClick}
        mfaVerificationState={mfaVerificationState}
        onSubmit={async(values: { OTP: string }) => {
          return await verifyCodeClick(values.OTP)
        }}
      />
    </>
  )
}
