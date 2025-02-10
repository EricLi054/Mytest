'use client'
import { Grid, Typography } from '@mui/material'
import { StyledLink } from '@/components/StyledComponents/Link.styled'
import { useMFAModalContext } from '../Context/MFAModalContext'
import { type MFAChannel, MFAState, MFAVerificationState } from '../Types/MFAEnums'
import { ResendCodeLink } from './ResendCodeLink'
import { ChangeMFAChannelLink } from './ChangeMFAChannelLink'
import { useFormApi } from '@data-driven-forms/react-form-renderer'
import { getMfaChannelString, getMFAStepString } from './mfaModalContent'
import { logEvent } from '@/utilities/analyticsTagging'

interface MFAModalFooterProps {
  handleMFAChangeChannel: () => void
  handleMFAResendCodeClick: () => void
}

export const MFAModalFooter: React.FC<MFAModalFooterProps> = ({
  handleMFAChangeChannel,
  handleMFAResendCodeClick
}) => {
  const {
    contentDefinition,
    mfaState,
    channel,
    hasSendAttemptsRemaining,
    isPhoneOnly
  } = useMFAModalContext()

  if (!contentDefinition) throw new Error('Content definition not found')

  const { reset } = useFormApi()

  const getEnvironmentLink = (path: string) =>
    window === undefined ? '' : new URL(path, window.location.origin).href

  return (
    <Grid container direction="column" gap={1}>
      {mfaState === MFAState.verifyCode && hasSendAttemptsRemaining && (
        <ResendCodeLink resendCodeClick={handleMFAResendCodeClick} />
      )}
      {hasSendAttemptsRemaining && !isPhoneOnly && (
        <ChangeMFAChannelLink
          handleMFAChannelChange={handleMFAChangeChannel}
        />
      )}
      <Typography variant="body2">
        {contentDefinition?.footerFAQLabel}{' '}
        <StyledLink
          href={getEnvironmentLink(contentDefinition.footerFAQLinkPath)}
          target="_blank"
          onClick={() => {
            logEvent(`${getMfaChannelString(channel as MFAChannel, isPhoneOnly)} - ${getMFAStepString(mfaState as MFAState, MFAVerificationState.initial)} - ${contentDefinition?.footerFAQAnalyticsText}`)
          }}
        >
          {contentDefinition?.footerFAQLinkText}
        </StyledLink>
      </Typography>
      <Typography variant="body2">
        {contentDefinition?.footerPhoneLabel}{' '}
        <StyledLink href={contentDefinition?.footerPhoneLinkUrl}
                    onClick={() => {
                      logEvent(`${getMfaChannelString(channel as MFAChannel, isPhoneOnly)} - ${getMFAStepString(mfaState as MFAState, MFAVerificationState.initial)} - ${contentDefinition?.footerPhoneAnalyticsText}`)
                      reset?.()
                    }}>
          {contentDefinition?.footerPhoneLinkText}
        </StyledLink>
      </Typography>
    </Grid>
  )
}
