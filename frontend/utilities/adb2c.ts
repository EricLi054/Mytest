'use server'

export async function getADB2CLogoutUrl(baseUrl: string) {
  const customUrl = process.env.AZURE_AD_B2C_CUSTOM_URL as string
  const tenantId = process.env.AZURE_AD_B2C_TENANT_ID as string
  const primaryUserFlow = process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW as string
  return `https://${customUrl}/${tenantId}/${primaryUserFlow}/oauth2/v2.0/logout?post_logout_redirect_uri=${baseUrl}`
}

export async function getADB2CTokenEndpoint(refresh: boolean) {
  const customUrl = process.env.AZURE_AD_B2C_CUSTOM_URL as string
  const tenantId = process.env.AZURE_AD_B2C_TENANT_ID as string
  const flow = refresh
    ? (process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW as string)
    : (process.env.AZURE_AD_B2C_EMAIL_UPDATE_FLOW as string)
  return `https://${customUrl}/${tenantId}/${flow}/oauth2/v2.0/token`
}

export async function getADB2CUpdatePasswordUrl(
  redirectUrl: string,
  currentUrl: string
) {
  const customUrl = process.env.AZURE_AD_B2C_CUSTOM_URL as string
  const tenantId = process.env.AZURE_AD_B2C_TENANT_ID as string
  const passwordUpdateFlow = process.env.AZURE_AD_B2C_PASSWORD_UPDATE_FLOW as string
  const clientId = process.env.AZURE_AD_B2C_CLIENT_ID as string
  return `https://${customUrl}/${tenantId}/${passwordUpdateFlow}/oauth2/v2.0/authorize?client_id=${clientId}&redirect_uri=${currentUrl}&response_type=code&scope=${clientId} offline_access openid profile&state=${redirectUrl}`
}

export async function getADB2CUpdateEmailUrl(
  redirectUrl: string,
  currentUrl: string
) {
  const customUrl = process.env.AZURE_AD_B2C_CUSTOM_URL as string
  const tenantId = process.env.AZURE_AD_B2C_TENANT_ID as string
  const emailUpdateFlow = process.env.AZURE_AD_B2C_EMAIL_UPDATE_FLOW as string
  const clientId = process.env.AZURE_AD_B2C_CLIENT_ID as string
  return `https://${customUrl}/${tenantId}/${emailUpdateFlow}/oauth2/v2.0/authorize?client_id=${clientId}&redirect_uri=${currentUrl}&response_type=code&scope=${clientId} offline_access openid profile&state=${redirectUrl}`
}
