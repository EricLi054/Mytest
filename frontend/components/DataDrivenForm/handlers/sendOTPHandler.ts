'use server'
import { type MFAChannel } from '@/components/ClientComponents/MFA/Types/MFAEnums'
import sendOTP, { type SendOtpResponse } from '@/graphql/sendOTP'
import ensureValidSession from '@/utilities/auth/ensureServerSession'
import { getAccessToken } from '@/utilities/getAccessToken'
import { getCrmId } from '@/utilities/getCrmId'

const sendOTPHandler = async(
  channel: MFAChannel
): Promise<SendOtpResponse> => {
  await ensureValidSession()
  const token = await getAccessToken()
  const result = await sendOTP(channel, token)

  const crmId = await getCrmId()
  console.log(
    `MFA: sendOTPHandler called with crmId ${
      crmId || 'unknown'
    } and channel ${channel}, the result is ${JSON.stringify(result)}`
  )
  return result
}

export default sendOTPHandler
