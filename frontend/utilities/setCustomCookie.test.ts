// setCustomCookie.test.js

import setCustomCookie from './setCustomCookie'

const mockedSet = jest.fn()
const mockedGet = jest.fn()
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    set: mockedSet,
    get: mockedGet
  }))
}))

describe('setCustomCookie', () => {
  it('should set custom cookie correctly', async() => {
    // Mock existing cookies (return values when get is called)
    mockedGet.mockReturnValueOnce(undefined) // Simulate custom cookie not existing

    await setCustomCookie('mock_cookie_name', 'mock_cookie_value')

    // Check if cookies are set with correct parameters
    expect(mockedSet).toHaveBeenCalledWith({
      name: 'mock_cookie_name',
      value: 'mock_cookie_value',
      httpOnly: true,
      path: '/',
      secure: true,
      domain: 'ractest.com.au'
    })
  })

  // Add more test cases for error handling scenarios if needed
})
