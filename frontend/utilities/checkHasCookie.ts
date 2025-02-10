'use server'

import { cookies } from 'next/headers'

export default async function checkHasCookie(cookieName: string) {
  return cookies().has(cookieName)
}
