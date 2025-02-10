'use server'
import checkOTP, { type CheckOtpResponse } from '@/graphql/checkOTP'
import ensureValidSession from '@/utilities/auth/ensureServerSession'
import { getAccessToken } from '@/utilities/getAccessToken'
import { getCrmId } from '@/utilities/getCrmId'

const checkOTPHandler = async(): Promise<CheckOtpResponse> => {
  await ensureValidSession()
  const token = await getAccessToken()
  const result = await checkOTP(token)

  const crmId = await getCrmId()
  console.log(
    `MFA: checkOTPHandler called with crmId ${
      crmId || 'unknown'
    }, isVerified is ${JSON.stringify(
      result.checkOtpQueryResponse?.isVerified
    )}, errors: ${JSON.stringify(result.errors)}`
  )
  return result
}

export default checkOTPHandler
