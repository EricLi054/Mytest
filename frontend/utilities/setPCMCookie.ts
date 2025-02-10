import 'server-only'

import { cookies } from 'next/headers'
import { getUUID, createCookieString, createValidationString } from './cryptographyService'

async function setPCMCookie(crmId: string) {
  if (!crmId) return null

  const cookieStore = cookies()

  // Check if UUID cookie already exists
  const existingUUID = cookieStore.get('UUID')
  if (existingUUID) {
    cookieStore.delete('UUID')
  }

  // Check if Validation cookie already exists
  const existingValidation = cookieStore.get('Validation')
  if (existingValidation) {
    cookieStore.delete('Validation')
  }

  // Generate UUID (you can use any method to generate UUID)
  const uuid = await getUUID(crmId)

  if (!uuid) return null

  // Encrypt the UUID and create a validation hash
  const encryptedUUID = createCookieString(uuid)
  const encryptedValidation = createValidationString(uuid)

  if (!encryptedUUID || !encryptedValidation) return null

  const domain = process.env.NEXTAUTH_URL?.includes('rac.com.au') ? 'rac.com.au' : 'ractest.com.au'

  if (!existingUUID) {
    cookieStore.set({
      name: 'UUID',
      value: encryptedUUID,
      httpOnly: true,
      path: '/',
      secure: true,
      domain
    })
  }

  if (!existingValidation) {
    cookieStore.set({
      name: 'Validation',
      value: encryptedValidation,
      httpOnly: true,
      path: '/',
      secure: true,
      domain
    })
  }
}

export default setPCMCookie
