import { type Session, type Account } from 'next-auth'
import { getDecodedToken, jwtCallback, sessionCallback } from './utils'
import fetchMock from 'jest-fetch-mock'
import { type AdapterUser } from 'next-auth/adapters'

fetchMock.enableMocks()
process.env = {
  NODE_ENV: 'test',
  AZURE_AD_B2C_CUSTOM_URL: 'testCustomUrl',
  AZURE_AD_B2C_TENANT_ID: 'testTenantID',
  AZURE_AD_B2C_CLIENT_ID: 'testClientId',
  AZURE_AD_B2C_CLIENT_SECRET: 'testClientSecret',
  AZURE_AD_B2C_PRIMARY_USER_FLOW: 'testPrimaryUserFlow'
}

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    set: jest.fn(),
    get: jest.fn()
  }))
}))

const mockAccessToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjRMMXJBanB5amJqaUpDbk1hMGpncmNPeFA5ZVRVdVRmNXJtZkliQnlUa2MiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJkZjYwZWQ5OC1iNjE3LTRkOGEtYmQ3YS00NmZiYzA2NTU4ZGMiLCJuYW1lIjoiZGFuLW1hbjFAY21neng2cG4ubWFpbG9zYXVyLm5ldCIsImV4dGVuc2lvbl9jcm1JZCI6IjM2MDM4NzMxLTFhYjktZTkxMS1hOTdhLTAwMGQzYWQyNGEwZCIsImVtYWlsIjoiZGFuLW1hbjFAY21neng2cG4ubWFpbG9zYXVyLm5ldCIsInRpZCI6ImZmNWRiZTMyLWJkZTktNDBmNS05OTE2LWEwN2I0MzM1N2Q5ZSIsImF6cCI6ImFlZWVmZTFlLTBkOWYtNGUwZS05MDgwLWY0ZjdmNGUwNzdlMCIsInZlciI6IjEuMCIsImlhdCI6MTcwOTE3ODIyNywiYXVkIjoiYWVlZWZlMWUtMGQ5Zi00ZTBlLTkwODAtZjRmN2Y0ZTA3N2UwIiwiZXhwIjoxNzA5MTgwMDI3LCJpc3MiOiJodHRwczovL3JhY3dhYjJjc2l0LmIyY2xvZ2luLmNvbS9mZjVkYmUzMi1iZGU5LTQwZjUtOTkxNi1hMDdiNDMzNTdkOWUvdjIuMC8iLCJuYmYiOjE3MDkxNzgyMjd9.D2_-OqSIAfgtD0QCv8DU09jaEcy9Y_Xy_de7eeuQefAJ8dNYlS85EVifKcNIEEoi3pwYnTfDEKVtW4Rg5jx-tP0FxTHKKo8q3s4CrDIn8CynSVYZNRXcSkxld-4mJYAPBjQr3WSkFINUnM7lSvNhw1wqd99GXs_Z7-UAP7m2Dm4PYnQcKZ5WOIUsm5QqISrrx6O_3KQZgGJTDM2cSnTN-KEP1lclEukvuiaBQJ3b51i3wEBgg10jmBfOKkmDw3PbvdEIR-vZJ6UJoleAm5KucgaZ7CPUSlkKoR09TorDNodNA6p-QjgVEy-DeqMZpNyfcU4SLn504hGDwlhXnZDMpA'

describe('jwtCallback functions', () => {
  beforeEach(() => {
    // Clear and reset fetch mocks before each test
    fetchMock.resetMocks()
  })
  test('can decode access token', async() => {
    const decoded = await getDecodedToken(mockAccessToken)
    expect(decoded.email).toEqual('dan-man1@cmgzx6pn.mailosaur.net')
    expect(decoded.crmid).toEqual('36038731-1ab9-e911-a97a-000d3ad24a0d')
  })

  test('should update token when user has just signed in', async() => {
    const pastExpiry = Date.now() - 1000
    const futureExpiry = Date.now() / 1000 + 3600
    const account: Account = {
      access_token: mockAccessToken,
      refresh_token: 'newRefreshToken',
      expires_on: futureExpiry,
      providerAccountId: '',
      provider: '',
      type: 'oauth'
    }
    const token = {
      otherfield: 'otherfield',
      access_token: 'oldAccessToken',
      refresh_token: 'oldRefreshToken',
      expires_on: pastExpiry
    }

    const result = await jwtCallback({ token, account })

    expect(result).toEqual({
      otherfield: 'otherfield',
      access_token: mockAccessToken,
      refresh_token: 'newRefreshToken',
      expires_on: futureExpiry * 1000
    })
  })

  test('should refresh token when access token needs refreshing', async() => {
    const account = null
    const pastExpiry = Date.now() + 60000 * 3 // set token to expire in 3 minutes (within refresh period)
    const futureExpiry = Date.now() / 1000 + 3600
    const token = {
      otherfield: 'otherfield',
      access_token: 'oldAccessToken',
      refresh_token: 'oldRefreshToken',
      expires_on: pastExpiry
    }

    const mockTokens = {
      access_token: mockAccessToken,
      refresh_token: 'newRefreshToken',
      expires_on: futureExpiry
    }

    fetchMock.mockResponseOnce(JSON.stringify(mockTokens))

    const result = await jwtCallback({ token, account })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toMatch('https://testCustomUrl/testTenantID/testPrimaryUserFlow/oauth2/v2.0/token')
    expect(result).toEqual({
      otherfield: 'otherfield',
      access_token: mockAccessToken,
      refresh_token: 'newRefreshToken',
      expires_on: futureExpiry * 1000
    })
  })

  test('should keep existing refresh token if a new refresh is not present', async() => {
    const account = null
    const pastExpiry = Date.now() + 60000 * 3 // set token to expire in 3 minutes (within refresh period)
    const futureExpiry = Date.now() / 1000 + 3600
    const token = {
      otherfield: 'otherfield',
      access_token: 'oldAccessToken',
      refresh_token: 'oldRefreshToken',
      expires_on: pastExpiry
    }

    const mockTokens = {
      access_token: mockAccessToken,
      expires_on: futureExpiry
    }

    fetchMock.mockResponseOnce(JSON.stringify(mockTokens))

    const result = await jwtCallback({ token, account })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toMatch(/oauth2\/v2.0\/token/)
    expect(result).toEqual({
      otherfield: 'otherfield',
      access_token: mockAccessToken,
      refresh_token: 'oldRefreshToken',
      expires_on: futureExpiry * 1000
    })
  })

  test('should throw an error when refreshing token fails', async() => {
    const account = null
    const pastExpiry = Date.now() + 60000 * 3 // set token to expire in 3 minutes (within refresh period)
    const token = {
      otherfield: 'otherfield',
      access_token: 'oldAccessToken',
      refresh_token: 'oldRefreshToken',
      expires_on: pastExpiry
    }

    console.error = jest.fn()
    fetchMock.mockRejectOnce(new Error('Failed to refresh token'))

    await expect(jwtCallback({ token, account })).rejects.toThrow(
      'JWT Callback error'
    )
    expect(console.error).toHaveBeenCalledWith('Error: getAccessToken.js - Error getting token.', new Error('Failed to refresh token'))
  })

  test('should return the same token when access token is not expired', async() => {
    const account = null
    const futureExpiry = Date.now() + 3600000
    const token = {
      otherfield: 'otherfield',
      access_token: mockAccessToken,
      refresh_token: 'oldRefreshToken',
      expires_on: futureExpiry // Some future timestamp
    }

    const result = await jwtCallback({ token, account })

    expect(result).toEqual(token)
  })

  test('should update session when user has just changed email', async() => {
    const pastExpiry = Date.now() - 1000
    const futureExpiry = Date.now() / 1000 + 3600
    const session: any = {
      code: 'azure_authorization_code'
    }
    const token = {
      otherfield: 'otherfield',
      access_token: 'oldAccessToken',
      refresh_token: 'oldRefreshToken',
      expires_on: pastExpiry
    }

    // need a real token for testing the decoding
    const newEmail = 'dan-man1@cmgzx6pn.mailosaur.net'
    const mockTokens = {
      access_token: mockAccessToken,
      refresh_token: 'newRefreshToken',
      expires_on: futureExpiry
    }

    fetchMock.mockResponseOnce(JSON.stringify(mockTokens))

    const result = await jwtCallback({ token, account: null, trigger: 'update', session })

    expect(result).toEqual({
      otherfield: 'otherfield',
      access_token: mockAccessToken,
      refresh_token: 'newRefreshToken',
      expires_on: futureExpiry * 1000,
      email: newEmail,
      name: newEmail
    })
  })
  test('should force refresh session when user has clicked refresh button', async() => {
    const pastExpiry = Date.now() - 1000
    const futureExpiry = Date.now() / 1000 + 3600
    const session: any = {
      refresh: true
    }
    const token = {
      otherfield: 'otherfield',
      access_token: 'oldAccessToken',
      refresh_token: 'oldRefreshToken',
      expires_on: pastExpiry
    }

    // need a real token for testing the decoding
    const mockTokens = {
      access_token: mockAccessToken,
      refresh_token: 'newRefreshToken',
      expires_on: futureExpiry
    }

    fetchMock.mockResponseOnce(JSON.stringify(mockTokens))

    const result = await jwtCallback({ token, account: null, trigger: 'update', session })

    expect(result).toEqual({
      otherfield: 'otherfield',
      access_token: mockAccessToken,
      refresh_token: 'newRefreshToken',
      expires_on: futureExpiry * 1000
    })
  })
})

describe('sessionCallback functions', () => {
  beforeEach(() => {
    // Clear and reset fetch mocks before each test
    fetchMock.resetMocks()
  })
  test('should pass expiry date to session', async() => {
    const pastExpiry = Date.now() - 1000

    const token = {
      otherfield: 'otherfield',
      access_token: 'oldAccessToken',
      refresh_token: 'oldRefreshToken',
      expires_on: pastExpiry
    }

    const session: Session = {
      expires: 'next.js expiry',
      user: {
        name: 'tester',
        email: 'tester@tester.com'
      }
    }

    const user: AdapterUser = {
      id: '1234',
      email: 'tester@tester.com',
      emailVerified: new Date()
    }

    const result = await sessionCallback({ token, session, user })

    expect(result).toEqual({
      ...session,
      expires: pastExpiry.toString()
    })
  })
})
