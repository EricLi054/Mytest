import 'server-only'

import { cookies } from 'next/headers'

async function setCustomCookie(name: string, value: string) {
  const cookieStore = cookies()

  // Check if the cookie already exists
  const cookieExists = cookieStore.get(name)

  // If both cookies already exist, return early
  if (cookieExists) {
    return
  }

  const domain = process.env.NEXTAUTH_URL?.includes('rac.com.au') ? 'rac.com.au' : 'ractest.com.au'

  if (!cookieExists) {
    cookieStore.set({
      name,
      value,
      httpOnly: true,
      path: '/',
      secure: true,
      domain
    })
  }
}

export default setCustomCookie
