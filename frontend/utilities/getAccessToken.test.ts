import { getAccessToken } from './getAccessToken'

const mockedGet = jest.fn()
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: mockedGet
  }))
}))

jest.mock('next-auth/jwt', () => ({
  decode: ({ token }: { token: string, secret: string }) => token
}))

describe('getAccessToken', () => {
  test('should get access token from cookie and decode', async() => {
    mockedGet.mockReturnValueOnce({ value: { access_token: 'token' } })
    const res = await getAccessToken()
    expect(res).toBe('token')
  })
})
