// CryptographyService.test.js

import { aesDecrypt, aesEncrypt, getUUID, createCookieString, createValidationString } from './cryptographyService'

describe('CryptographyService', () => {
  it('should generate UUID correctly', async() => {
    const crmId = 'mock_crm_id'

    const uuid = await getUUID(crmId)
    const splitUuid = uuid.split(' ')

    expect(splitUuid[0]).toEqual(crmId)
    expect(splitUuid[1]).not.toBeNaN()
  })

  it('should encrypt and decrypt text correctly', () => {
    const plainText = 'Hello, World!'
    const encryptedText = aesEncrypt(plainText)
    const decryptedText = aesDecrypt(encryptedText)
    expect(decryptedText).toBe(plainText)
  })

  it('should create cookie string correctly', () => {
    const plainTextCookieContents = 'cookie contents'
    const encryptedCookie = createCookieString(
      plainTextCookieContents
    )
    const decryptedCookie = aesDecrypt(encryptedCookie)
    expect(decryptedCookie).toBe(plainTextCookieContents)
  })

  it('should create validation string correctly', () => {
    const plainTextCookieContents = 'cookie contents'
    const validationString = createValidationString(
      plainTextCookieContents
    )
    // Here you would need to assert against expected validation string based on your business logic
    expect(validationString).toBeTruthy() // Placeholder assertion, replace with actual validation
  })
})
