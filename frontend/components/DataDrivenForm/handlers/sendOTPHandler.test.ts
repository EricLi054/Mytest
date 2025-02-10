import { MFAChannel } from '@/components/ClientComponents/MFA/Types/MFAEnums'
import sendOTPHandler from './sendOTPHandler'
import sendOTP from '@/graphql/sendOTP'
import ensureValidSession from '@/utilities/auth/ensureServerSession'
import { testHelper } from '@/__tests__/helpers/testHelpers'

jest.mock('../../../utilities/getAccessToken', () => ({
  getAccessToken: () => jest.fn()
}))

jest.mock('../../../utilities/getCrmId', () => ({
  getCrmId: () => jest.fn()
}))

jest.mock('../../../graphql/sendOTP', () => jest.fn())

jest.mock('../../../utilities/auth/ensureServerSession', () => jest.fn())

testHelper.mockConsole()

describe('Send OTP Handler', () => {
  it('returns the expected response', async() => {
    jest.mocked(ensureValidSession).mockReturnValue(Promise.resolve())
    jest.mocked(sendOTP).mockReturnValueOnce(Promise.resolve({
      errors: undefined,
      sendOtpResponse: {
        hasSendAttemptsRemaining: true
      }
    }))

    const expectedOutput = {
      errors: undefined,
      sendOtpResponse: {
        hasSendAttemptsRemaining: true
      }
    }

    const res = await sendOTPHandler(MFAChannel.sms)
    expect(res).toEqual(expectedOutput)
  })
  it('fails if server session is bad', async() => {
    jest.mocked(ensureValidSession).mockRejectedValue(() => { throw new Error('Unauthorized') })
    await expect(sendOTPHandler(MFAChannel.sms)).rejects.toThrow(
      'Unauthorized'
    )
  })
})
