import checkOTP, { type CheckOtpResponse } from './checkOTP'
import getData from './getData'

jest.mock('./getData', () => jest.fn())

describe('checkOTP', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Landline returns person.homePhone when person.homePhone is defined', async () => {
    jest.mocked(getData).mockReturnValue(
      Promise.resolve({
        checkOtp: {
          isVerified: false
        },
        person: {
          mobilePhone: undefined,
          homePhone: '1111111111'
        }
      })
    )

    const token = 'test-token'
    const expectedResponse: CheckOtpResponse = {
      errors: undefined,
      checkOtpQueryResponse: {
        isVerified: false,
        mobilePhone: undefined,
        landline: '1111111111'
      }
    }

    const response = await checkOTP(token)
    expect(response).toEqual(expectedResponse)
    expect(jest.mocked(getData)).toHaveBeenCalledTimes(1)
  })

  it('MobilePhone returns person.mobilePhone when person.mobilePhone is defined', async () => {
    jest.mocked(getData).mockReturnValue(
      Promise.resolve({
        checkOtp: {
          isVerified: false
        },
        person: {
          mobilePhone: '1111111111',
          homePhone: '2222222222'
        }
      })
    )

    const token = 'test-token'
    const expectedResponse: CheckOtpResponse = {
      errors: undefined,
      checkOtpQueryResponse: {
        isVerified: false,
        mobilePhone: '1111111111',
        landline: '2222222222'
      }
    }

    const response = await checkOTP(token)
    expect(response).toEqual(expectedResponse)
    expect(jest.mocked(getData)).toHaveBeenCalledTimes(1)
  })

  it('Landline returns undefined when person.homePhone is undefined', async () => {
    jest.mocked(getData).mockReturnValue(
      Promise.resolve({
        checkOtp: {
          isVerified: false
        },
        person: {
          mobilePhone: undefined,
          homePhone: undefined
        }
      })
    )

    const token = 'test-token'
    const expectedResponse: CheckOtpResponse = {
      errors: undefined,
      checkOtpQueryResponse: {
        isVerified: false,
        mobilePhone: undefined,
        landline: undefined
      }
    }

    const response = await checkOTP(token)
    expect(response).toEqual(expectedResponse)
    expect(jest.mocked(getData)).toHaveBeenCalledTimes(1)
  })
})
