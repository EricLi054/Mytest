import 'server-only'
import { getAccessToken } from './getAccessToken'
import { getDecodedToken } from './auth/utils'

export async function getCrmId(): Promise<string | undefined> {
  try {
    const accessToken = await getAccessToken()
    const { crmid } = await getDecodedToken(accessToken)
    return crmid
  } catch {
    return undefined
  }
}
