/**
 * @jest-environment node
 */
import { GET } from './route'

const unmockedFetch = global.fetch

afterAll(() => {
  global.fetch = unmockedFetch
})

// Write a test using Jest
test('should return a healthy confirmation', async() => {
  global.fetch = async() =>
    await Promise.resolve(new Response('', { status: 200 }))
  const data = await GET()

  // Assert the expected behavior
  expect(data.status).toEqual(200)
  expect(await data.json()).toStrictEqual('Ready')
})

test('should return a healthy confirmation', async() => {
  global.fetch = async() =>
    await Promise.resolve(new Response('', { status: 500 }))

  const data = await GET()

  // Assert the expected behavior
  expect(data.status).toEqual(503)
  expect(await data.json()).toStrictEqual('Not ready')
})
