import 'server-only'
import { decode } from 'next-auth/jwt'
import { cookies } from 'next/headers'

export async function getAccessToken(): Promise<string> {
  try {
    const cookieName = process.env.NEXTAUTH_URL?.startsWith('https://')
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token'
    const token = cookies().get(cookieName)
    const decoded = await decode({ token: token?.value, secret: process.env.NEXTAUTH_SECRET as string })
    return decoded?.access_token as string
  } catch {
    return ''
  }
}
