import checkHasCookie from './checkHasCookie'

const mockedHas = jest.fn()
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    has: mockedHas
  }))
}))

describe('checkHasCookie', () => {
  test('has cookie', async() => {
    mockedHas.mockReturnValueOnce(true)
    const res = await checkHasCookie('testCookie')
    expect(res).toBeTruthy()
  })
  test('doesn\'t have cookie', async() => {
    mockedHas.mockReturnValueOnce(false)
    const res = await checkHasCookie('testCookie')
    expect(res).toBeFalsy()
  })
})
