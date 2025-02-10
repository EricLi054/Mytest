// setPCMCookie.test.js

import setPCMCookie from './setPCMCookie'

const mockedSet = jest.fn()
const mockedGet = jest.fn()
const mockedDelete = jest.fn()
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    set: mockedSet,
    get: mockedGet,
    delete: mockedDelete
  }))
}))

jest.mock('./cryptographyService', () => ({
  getUUID: () => 'mocked_uuid',
  createCookieString: (text: string) => text,
  createValidationString: (text: string) => text
}))

describe('setPCMCookie', () => {
  beforeEach(() => {
    // Reset mock usage before each test
    jest.clearAllMocks()
  })

  it('should set PCM cookies correctly', async() => {
    // Mock existing cookies (return values when get is called)
    mockedGet.mockReturnValueOnce(undefined) // Simulate UUID cookie not existing
    mockedGet.mockReturnValueOnce(undefined) // Simulate Validation cookie not existing

    await setPCMCookie('mock_crm_id')

    // Check if cookies are set with correct parameters
    expect(mockedSet).toHaveBeenCalledWith({
      name: 'UUID',
      value: 'mocked_uuid',
      httpOnly: true,
      path: '/',
      secure: true,
      domain: 'ractest.com.au'
    })
    expect(mockedSet).toHaveBeenCalledWith({
      name: 'Validation',
      value: 'mocked_uuid',
      httpOnly: true,
      path: '/',
      secure: true,
      domain: 'ractest.com.au'
    })
  })

  it('should delete cookies', async() => {
    // Simulate existing UUID and Validation cookie values
    mockedGet.mockReturnValueOnce({ value: '1234' })
    mockedGet.mockReturnValueOnce({ value: '5678' })

    await setPCMCookie('mock_crm_id')

    // Check that the deletion of cookies occurred
    expect(mockedDelete).toHaveBeenCalledWith('UUID')
    expect(mockedDelete).toHaveBeenCalledWith('Validation')
  })
})
