import { getADB2CLogoutUrl, getADB2CTokenEndpoint, getADB2CUpdatePasswordUrl, getADB2CUpdateEmailUrl } from './adb2c'

process.env = {
  NODE_ENV: 'test',
  AZURE_AD_B2C_CUSTOM_URL: 'testCustomUrl',
  AZURE_AD_B2C_TENANT_ID: 'testTenantID',
  AZURE_AD_B2C_CLIENT_ID: 'testClientId',
  AZURE_AD_B2C_CLIENT_SECRET: 'testClientSecret',
  AZURE_AD_B2C_PRIMARY_USER_FLOW: 'testPrimaryUserFlow',
  AZURE_AD_B2C_PASSWORD_UPDATE_FLOW: 'testPasswordUpdateFlow',
  AZURE_AD_B2C_EMAIL_UPDATE_FLOW: 'testEmailUpdateFlow'
}

describe('adb2c url functions', () => {
  test('get logout url', async() => {
    const url = await getADB2CLogoutUrl('testUrl')
    expect(url).toEqual('https://testCustomUrl/testTenantID/testPrimaryUserFlow/oauth2/v2.0/logout?post_logout_redirect_uri=testUrl')
  })
  test('get token endpoint refresh', async() => {
    const url = await getADB2CTokenEndpoint(true)
    expect(url).toEqual('https://testCustomUrl/testTenantID/testPrimaryUserFlow/oauth2/v2.0/token')
  })
  test('get token endpoint update email', async() => {
    const url = await getADB2CTokenEndpoint(false)
    expect(url).toEqual('https://testCustomUrl/testTenantID/testEmailUpdateFlow/oauth2/v2.0/token')
  })
  test('get update password url', async() => {
    const url = await getADB2CUpdatePasswordUrl('testRedirectUrl', 'testCurrentUrl')
    expect(url).toEqual('https://testCustomUrl/testTenantID/testPasswordUpdateFlow/oauth2/v2.0/authorize?client_id=testClientId&redirect_uri=testCurrentUrl&response_type=code&scope=testClientId offline_access openid profile&state=testRedirectUrl')
  })
  test('get update email url', async() => {
    const url = await getADB2CUpdateEmailUrl('testRedirectUrl', 'testCurrentUrl')
    expect(url).toEqual('https://testCustomUrl/testTenantID/testEmailUpdateFlow/oauth2/v2.0/authorize?client_id=testClientId&redirect_uri=testCurrentUrl&response_type=code&scope=testClientId offline_access openid profile&state=testRedirectUrl')
  })
})
