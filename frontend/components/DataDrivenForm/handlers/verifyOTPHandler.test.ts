import ensureValidSession from '@/utilities/auth/ensureServerSession'
import verifyOTPHandler from './verifyOTPHandler'
import verifyOTP from '@/graphql/verifyOTP'
import { testHelper } from '@/__tests__/helpers/testHelpers'

jest.mock('../../../utilities/getAccessToken', () => ({
  getAccessToken: () => jest.fn()
}))

jest.mock('../../../utilities/getCrmId', () => ({
  getCrmId: () => jest.fn()
}))

jest.mock('../../../graphql/verifyOTP', () => jest.fn())

jest.mock('../../../utilities/auth/ensureServerSession', () => jest.fn())

testHelper.mockConsole()

describe('Verify OTP Handler', () => {
  it('successfully verified', async() => {
    jest.mocked(ensureValidSession).mockReturnValue(Promise.resolve())
    jest.mocked(verifyOTP).mockReturnValueOnce(Promise.resolve({
      errors: undefined,
      verifyOtpResponse: {
        isVerified: true
      }
    }))

    const expectedOutput = {
      errors: undefined,
      verifyOtpResponse: {
        isVerified: true
      }
    }

    const res = await verifyOTPHandler('123456')
    expect(res).toEqual(expectedOutput)
  })
  it('fails if server session is bad', async() => {
    jest.mocked(ensureValidSession).mockRejectedValue(() => { throw new Error('Unauthorized') })
    await expect(verifyOTPHandler('123456')).rejects.toThrow(
      'Unauthorized'
    )
  })
  it('failed to verify', async() => {
    jest.mocked(ensureValidSession).mockReturnValue(Promise.resolve())
    jest.mocked(verifyOTP).mockReturnValueOnce(Promise.resolve({
      errors: undefined,
      verifyOtpResponse: {
        isVerified: false
      }
    }))

    const expectedOutput = {
      errors: undefined,
      verifyOtpResponse: {
        isVerified: false
      }
    }

    const res = await verifyOTPHandler('123456')
    expect(res).toEqual(expectedOutput)
  })
})
