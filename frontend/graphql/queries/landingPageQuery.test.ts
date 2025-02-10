import { landingPageQuery } from './landingPageQuery'

describe('landingPageQuery', () => {
  test('should generate the correct query for a given slug', () => {
    const slug = 'example-slug'
    const expectedQuery = 'page: landingPageCollection(limit: 1, where: {slug: \\"example-slug\\"})'

    expect(landingPageQuery(slug)).toContain(expectedQuery)
  })
})
