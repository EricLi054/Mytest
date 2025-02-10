import 'server-only'

import crypto from 'crypto'

const SHA256Hash = (input: Buffer) => {
  return crypto.createHash('sha256').update(input).digest()
}

const _aesKey = SHA256Hash(Buffer.from(process.env.AES_KEY ?? '')).slice(0, 16)
const _sharedSecretKey = Buffer.from(process.env.HASH_KEY ?? '')

export const aesEncrypt = (plainText: string) => {
  const cipher = crypto.createCipheriv(
    'aes-128-ecb',
    _aesKey,
    Buffer.alloc(0)
  )
  let encrypted = cipher.update(plainText, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return encrypted
}

export const aesDecrypt = (encryptedString: string) => {
  const decipher = crypto.createDecipheriv(
    'aes-128-ecb',
    _aesKey,
    Buffer.alloc(0)
  )
  let decrypted = decipher.update(encryptedString, 'base64', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted.trim()
}

export const createValidationHash = (data: string) => {
  const decryptedBytes = Buffer.from(aesDecrypt(data), 'utf8')
  const sharedSecretKeyBuffer = Buffer.from(_sharedSecretKey) // Convert to Buffer
  const combinedBytes = Buffer.concat([
    Buffer.from(data),
    SHA256Hash(decryptedBytes),
    sharedSecretKeyBuffer
  ])
  return SHA256Hash(combinedBytes)
}

export const getUUID = async(crmId: string) => {
  const jan1st1970 = new Date(Date.UTC(1970, 0, 1, 0, 0, 0))
  const epochTimestamp = new Date().getTime() - jan1st1970.getTime()
  return `${crmId} ${epochTimestamp}`
}

export const createCookieString = (plainTextCookieContents: string) => {
  return aesEncrypt(plainTextCookieContents)
}

export const createValidationString = (plainTextCookieContents: string) => {
  const encryptedData = aesEncrypt(plainTextCookieContents)
  const validationHash = createValidationHash(encryptedData)
  return validationHash.toString('base64')
}
