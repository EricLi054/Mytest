'use server'
import verifyOTP, { type VerifyOtpResponse } from '@/graphql/verifyOTP'
import ensureValidSession from '@/utilities/auth/ensureServerSession'
import { getAccessToken } from '@/utilities/getAccessToken'
import { getCrmId } from '@/utilities/getCrmId'

const verifyOTPHandler = async(
  otpCode: string
): Promise<VerifyOtpResponse> => {
  await ensureValidSession()
  const token = await getAccessToken()
  const result = await verifyOTP(otpCode, token)

  const crmId = await getCrmId()
  console.log(
    `MFA: verifyOTPHandler called with crmId ${
      crmId || 'unknown'
    }, the result is ${JSON.stringify(result)}`
  )
  return result
}

export default verifyOTPHandler
