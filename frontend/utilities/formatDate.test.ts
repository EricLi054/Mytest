import { formatDate } from '@/utilities/formatDate'

describe('formatDate', () => {
  test('should format a valid Date object', () => {
    const date = new Date('2022-01-01')
    expect(formatDate(date)).toBe('1 Jan 2022')
  })
})
