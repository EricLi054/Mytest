'use client'
import { Button, Typography } from '@mui/material'
import { MFAChannel } from '../Types/MFAEnums'
import { useMFAModalContext } from '../Context/MFAModalContext'

export interface MFAVerifyItsYouModalContentProps {
  sendCodeClick: () => void
}

export const MFAVerifyItsYouModalContent: React.FC<
MFAVerifyItsYouModalContentProps
> = ({
  sendCodeClick
}) => {
  const { contentDefinition, channel } = useMFAModalContext()
  return (
    <>
      <Typography variant="body1">
        {channel === MFAChannel.sms
          ? contentDefinition?.requestCodeSMSBodyText
          : contentDefinition?.requestCodePhoneBodyText}
      </Typography>

      <Button color="primary" onClick={sendCodeClick}>
        {channel === MFAChannel.sms
          ? contentDefinition?.requestCodeSMSButtonText
          : contentDefinition?.requestCodePhoneButtonText}
      </Button>
    </>
  )
}
