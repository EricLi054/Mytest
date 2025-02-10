import ensureValidSession from '@/utilities/auth/ensureServerSession'
import checkOTPHandler from './checkOTPHandler'
import checkOTP from '@/graphql/checkOTP'
import { testHelper } from '@/__tests__/helpers/testHelpers'

jest.mock('../../../utilities/getAccessToken', () => ({
  getAccessToken: () => jest.fn()
}))

jest.mock('../../../utilities/getCrmId', () => ({
  getCrmId: () => jest.fn()
}))

jest.mock('../../../graphql/checkOTP', () => jest.fn())

jest.mock('../../../utilities/auth/ensureServerSession', () => jest.fn())

testHelper.mockConsole()

describe('Check OTP Handler', () => {
  it('returns the expected response with a valid session', async() => {
    jest.mocked(ensureValidSession).mockReturnValue(Promise.resolve())
    jest.mocked(checkOTP).mockReturnValueOnce(Promise.resolve({
      errors: undefined,
      checkOtpQueryResponse: {
        isVerified: false,
        mobilePhone: '04******79',
        landline: ''
      }
    }))

    const expectedOutput = {
      errors: undefined,
      checkOtpQueryResponse: {
        isVerified: false,
        mobilePhone: '04******79',
        landline: ''
      }
    }

    const res = await checkOTPHandler()
    expect(res).toEqual(expectedOutput)
  })
  it('fails if server session is bad', async() => {
    jest.mocked(ensureValidSession).mockRejectedValue(() => { throw new Error('Unauthorized') })
    await expect(checkOTPHandler()).rejects.toThrow(
      'Unauthorized'
    )
  })
})
