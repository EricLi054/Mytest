import { errorPageQuery } from './errorPageQuery'

describe('errorPageQuery', () => {
  test('should generate the correct query for a given type', () => {
    const type = 'not-found'
    const expectedQuery = 'page: errorPageCollection(limit: 1, where: {type: \\"not-found\\"})'

    expect(errorPageQuery(type)).toContain(expectedQuery)
  })
})
