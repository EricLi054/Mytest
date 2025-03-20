// General/miscellaneous utility types and functions used by the package.

export enum DataCacheError {
  KeyConflict = "Key conflict",
  KeyLocked = "Key locked",
  KeyNotFound = "Key not found",
}

export const log = (message: string) => globalThis.enableCacheLogging && console.debug(`@racwa/cache: ${message}`);
