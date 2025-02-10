
import { jwtCallback, sessionCallback } from '@/utilities/auth/utils'
import NextAuth, { type AuthOptions } from 'next-auth'
import AzureADB2C from 'next-auth/providers/azure-ad-b2c'

function getOptions(): AuthOptions {
  return {
    providers: [
      AzureADB2C({
        clientId: process.env.AZURE_AD_B2C_CLIENT_ID ?? '',
        clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET ?? '',
        authorization: { params: { scope: `${process.env.AZURE_AD_B2C_CLIENT_ID ?? ''} offline_access openid profile` } },
        issuer: `https://${process.env.AZURE_AD_B2C_CUSTOM_URL as string}/${process.env.AZURE_AD_B2C_TENANT_ID as string}/${process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW as string}/v2.0/`,
        profile(profile) {
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.name,
            crm_id: profile.extension_crmId
          }
        }
      })
    ],
    session: {
      strategy: 'jwt',
      maxAge: 30 * 60 // 30 minutes
    },
    callbacks: {
      jwt: jwtCallback,
      session: sessionCallback
    },
    pages: {
      signIn: '/signIn/'
    }
  }
}

const handler = NextAuth(getOptions())

export { handler as GET, handler as POST }
