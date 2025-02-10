/**
 * @jest-environment node
 */
import { GET } from './route'

// Write a test using Jest
test('should return a 404 response', async() => {
  const data = await GET()

  // Assert the expected behavior
  expect(data.status).toEqual(404)
})
