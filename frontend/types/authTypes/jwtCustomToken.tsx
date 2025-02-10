import { type JWT } from "next-auth/jwt"

export interface JWTCustomToken extends JWT {
  access_token?: string
  expires_on?: number
  refresh_token?: string
  error?: 'RefreshAccessTokenError'
}
