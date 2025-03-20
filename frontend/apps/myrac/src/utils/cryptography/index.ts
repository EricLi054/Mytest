"server-only";

import crypto from "crypto";
import { serverEnv } from "#env/server";

const SHA256Hash = (input: Buffer) => {
  return crypto.createHash("sha256").update(input).digest();
};

const getAesKey = () => {
  const keyBuffer = Buffer.from(serverEnv().PCM_AES_KEY);
  const aesKey = SHA256Hash(keyBuffer).subarray(0, 16);

  return aesKey;
};

const getSharedSecretKey = () => {
  const sharedSecretKey = Buffer.from(serverEnv().PCM_HASH_KEY);
  return sharedSecretKey;
};

export const aesEncrypt = (plainText: string) => {
  const aesKey = getAesKey();
  const cipher = crypto.createCipheriv("aes-128-ecb", aesKey, Buffer.alloc(0));
  let encrypted = cipher.update(plainText, "utf8", "base64");
  // Return the encrypted data as a string in base64 encoding
  encrypted += cipher.final("base64");
  return encrypted;
};

export const aesDecrypt = (encryptedString: string) => {
  const aesKey = getAesKey();
  const decipher = crypto.createDecipheriv("aes-128-ecb", aesKey, Buffer.alloc(0));
  // Decrypt the data using AES using base64 encoding
  let decrypted = decipher.update(encryptedString, "base64", "utf8");
  // Return the decrypted data as a string in utf8 encoding
  decrypted += decipher.final("utf8");
  return decrypted.trim();
};

const createValidationHash = (data: string) => {
  // Decrypt the data using AES
  const decryptedData = aesDecrypt(data);
  const decryptedBytes = Buffer.from(decryptedData, "utf8");

  // Combine the original data (the encrypted base64 data), SHA256 of decrypted bytes, and the shared secret key

  const combinedBytes = Buffer.concat([
    Buffer.from(data, "base64"), // data needs to be converted to a buffer from base64 encoding
    SHA256Hash(decryptedBytes),
    getSharedSecretKey(),
  ]);

  return SHA256Hash(combinedBytes);
};

export const getUUID = (crmId: string) => {
  // Beginning of the epoch time
  const jan1st1970 = new Date(Date.UTC(1970, 0, 1, 0, 0, 0));
  // Offset it to get the current time
  const epochTimestamp = new Date().getTime() - jan1st1970.getTime();
  return `${crmId} ${epochTimestamp}`;
};

export const createCookieString = (plainTextCookieContents: string) => {
  // Encrypt the data using AES and return the base64 encoded string
  return aesEncrypt(plainTextCookieContents);
};

export const createValidationString = (plainTextCookieContents: string) => {
  const encryptedData = aesEncrypt(plainTextCookieContents);
  const validationHash = createValidationHash(encryptedData);
  return validationHash.toString("base64");
};
