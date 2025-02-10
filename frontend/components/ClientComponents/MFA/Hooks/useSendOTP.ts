import sendOTPHandler from '@/components/DataDrivenForm/handlers/sendOTPHandler'
import { MFAChannel } from '../Types/MFAEnums'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { defaultMFAModalContent, type MFAModalContentModel } from '../Content/mfaModalContent'
import { useLoadingContext } from '../../Loading/LoadingContext'
import { errorPage } from '@/utilities/errorPage'
import { logEvent } from '@/utilities/analyticsTagging'

export const useSendOTP = (
  content: MFAModalContentModel,
  mfaChannel: MFAChannel
) => {
  const loadingMessage = getLoadingMessage(mfaChannel, content)
  const [hasSendAttemptsRemaining, setHasSendAttemptsRemaining] = useState(true)
  const { openLoadingIndicator, closeLoadingIndicator } = useLoadingContext()

  const router = useRouter()

  const sendOTP = async(channel: MFAChannel) => {
    try {
      openLoadingIndicator(loadingMessage)
      const sendOTPResult = await sendOTPHandler(channel)
      if (sendOTPResult.errors || sendOTPResult.sendOtpResponse === undefined) {
        logEvent(defaultMFAModalContent.serverErrorAnalyticsText)
        throw Error(defaultMFAModalContent.serverErrorAnalyticsText)
      }

      setHasSendAttemptsRemaining(
        sendOTPResult.sendOtpResponse.hasSendAttemptsRemaining
      )

      return sendOTPResult
    } catch (error) {
      router.push(errorPage.somethingWentWrong)
      return undefined
    } finally {
      closeLoadingIndicator()
    }
  }

  return {
    sendOTP,
    hasSendAttemptsRemaining
  }
}

const getLoadingMessage = (
  channel: MFAChannel,
  content: MFAModalContentModel
) => {
  return channel === MFAChannel.sms
    ? content.requestCodeSMSLoadingText
    : content.requestCodePhoneLoadingText
}
