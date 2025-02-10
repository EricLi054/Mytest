import checkOTPHandler from '@/components/DataDrivenForm/handlers/checkOTPHandler'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useLoadingContext } from '../../Loading/LoadingContext'
import { errorPage } from '@/utilities/errorPage'
import { defaultMFAModalContent } from '../Content/mfaModalContent'
import { logEvent } from '@/utilities/analyticsTagging'

export const useCheckOTP = () => {
  const [mobilePhone, setMobilePhone] = useState('')
  const [landline, setLandline] = useState('')
  const router = useRouter()
  const { openLoadingIndicator, closeLoadingIndicator } = useLoadingContext()

  const checkOTP = async() => {
    try {
      openLoadingIndicator()
      const checkOTPResponse = await checkOTPHandler()
      if (
        checkOTPResponse.errors ||
        checkOTPResponse.checkOtpQueryResponse === undefined
      ) {
        logEvent(defaultMFAModalContent.serverErrorAnalyticsText)
        throw Error(defaultMFAModalContent.serverErrorAnalyticsText)
      }

      const mutationResponse = checkOTPResponse.checkOtpQueryResponse
      if (!mutationResponse?.mobilePhone && !mutationResponse?.landline) {
        logEvent(defaultMFAModalContent.serverNoContactsAnalyticsText)
        throw Error(defaultMFAModalContent.serverNoContactsAnalyticsText)
      }
      if (mutationResponse?.mobilePhone) {
        setMobilePhone(mutationResponse.mobilePhone)
      }
      if (mutationResponse?.landline) {
        setLandline(mutationResponse.landline)
      }

      return checkOTPResponse
    } catch (error) {
      router.push(errorPage.somethingWentWrong)
      return undefined
    } finally {
      closeLoadingIndicator()
    }
  }

  return {
    checkOTP,
    mobilePhone,
    landline
  }
}
