import 'server-only'

import { type JWTCustomToken } from '@/types/authTypes/jwtCustomToken'
import { type DefaultSession, type Session, type Account, type TokenSet } from 'next-auth'
import setPCMCookie from '../setPCMCookie'
import { getADB2CTokenEndpoint } from '@/utilities/adb2c'
import { type AdapterUser } from 'next-auth/adapters'

export async function getDecodedToken(token: string): Promise<{ email?: string, crmid?: string }> {
  const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
  return { email: decoded.email, crmid: decoded.extension_crmId }
}

async function getAccessToken(code: string, refresh: boolean): Promise<TokenSet | null> {
  const tokenEndpoint = await getADB2CTokenEndpoint(refresh)

  const body = new URLSearchParams({
    grant_type: refresh ? 'refresh_token' : 'authorization_code',
    client_id: process.env.AZURE_AD_B2C_CLIENT_ID as string,
    client_secret: process.env.AZURE_AD_B2C_CLIENT_SECRET as string,
    ...(refresh ? { refresh_token: code } : { code }),
    scope: `${process.env.AZURE_AD_B2C_CLIENT_ID as string} offline_access openid profile`
  })

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  })

  if (!response.ok) {
    console.error(`Error: getAccessToken.js - Code: ${response.status} Body: ${JSON.stringify(response.body)}`)
    throw new Error(`Error getting access token: ${response.statusText}`)
  }

  return await response.json()
}

export async function jwtCallback({
  token,
  account,
  trigger,
  session
}: {
  token: JWTCustomToken
  account: Account | null
  trigger?: 'signIn' | 'signUp' | 'update'
  session?: any
}): Promise<JWTCustomToken> {
  try {
    // Update trigger when we update the email
    if (trigger === 'update') {
      if (typeof session.code === 'string') {
        const tokens = await getAccessToken(session.code, false)
        if (tokens) {
          if (tokens.access_token) {
            // need to decode the access token to update the email address that is used on client side
            const { email } = await getDecodedToken(tokens.access_token)
            token.name = email
            token.email = email
            token.access_token = tokens.access_token
          }
          token.refresh_token = tokens.refresh_token ?? token.refresh_token
          token.expires_on = tokens.expires_on ? tokens.expires_on as number * 1000 : token.expires_on
        }
      }
      if (session.refresh && token.refresh_token) {
        const tokens = await getAccessToken(token.refresh_token, true)
        if (tokens) {
          token.access_token = tokens.access_token
          token.refresh_token = tokens.refresh_token ?? token.refresh_token
          token.expires_on = tokens.expires_on as number * 1000
        }
      }
    } else {
      // If the user has just signed in, create a new token
      if (account) {
        token.access_token = account.access_token
        token.refresh_token = account.refresh_token
        token.expires_on = account.expires_on as number * 1000
      }

      // If token expired, try to refresh it starting 10 minutes before it expires and stopping trying when the
      // manual refresh modal appears on the screen
      const tenMinutesBeforeExpiry = token?.expires_on as number - (10 * 60000)
      const twoMinutesBeforeExpiry = token?.expires_on as number - (2 * 60000)
      if (token.refresh_token && Date.now() > tenMinutesBeforeExpiry && Date.now() < twoMinutesBeforeExpiry) {
        const tokens = await getAccessToken(token.refresh_token, true)
        if (tokens) {
          token.access_token = tokens.access_token
          token.refresh_token = tokens.refresh_token ?? token.refresh_token
          token.expires_on = tokens.expires_on as number * 1000
        }
      }

      // If we have a token, set the pcm cookie
      if (token.access_token) {
        const { crmid } = await getDecodedToken(token.access_token)
        if (crmid) {
          await setPCMCookie(crmid)
        }
      }
    }

    return { ...token }
  } catch (error) {
    console.error('Error: getAccessToken.js - Error getting token.', error)
    throw new Error('JWT Callback error')
  }
}

export async function sessionCallback({
  token,
  session
}: {
  session: Session
  token: JWTCustomToken
  user: AdapterUser
}): Promise<Session | DefaultSession> {
  if (token.expires_on) {
    session.expires = token.expires_on.toString()
  }
  return session
}
