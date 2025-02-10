/**
 * @jest-environment node
 */
import { GET } from './route'

// Write a test using Jest
test('should return a healthy confirmation', async() => {
  const data = await GET()

  // Assert the expected behavior
  expect(data.status).toEqual(200)
  expect(await data.json()).toStrictEqual('Healthy')
})
