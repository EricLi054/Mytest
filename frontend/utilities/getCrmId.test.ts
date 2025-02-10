import { getAccessToken } from './getAccessToken'
import { getCrmId } from './getCrmId'

jest.mock('./getAccessToken', () => ({
  getAccessToken: jest.fn()
}))

jest.mock('./auth/utils', () => ({
  getDecodedToken: (token: string) => JSON.parse(token)
}))

describe('getCrmId', () => {
  it('should get access token from cookie and decode', async() => {
    jest.mocked(getAccessToken).mockReturnValueOnce(Promise.resolve('{ "crmid": "crmid" }'))
    const res = await getCrmId()
    expect(res).toBe('crmid')
  })
  it('should return undefined when error getting access token', async() => {
    jest.mocked(getAccessToken).mockImplementation(() => { throw new Error() })
    const res = await getCrmId()
    expect(res).toBe(undefined)
  })
})
