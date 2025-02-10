import { logEvent, logFieldTouched, logPageView } from './analyticsTagging'
import { event, fieldTouched, gtm, virtualPageView } from '@racwa/analytics'

// Mock @racwa/analytics module
jest.mock('@racwa/analytics', () => ({
  event: jest.fn(),
  fieldTouched: jest.fn(),
  gtm: jest.fn(),
  virtualPageView: jest.fn()
}))

describe('Analytics Logger', () => {
  afterEach(() => {
    jest.clearAllMocks() // Clear mock calls after each test
  })

  describe('logEvent', () => {
    it('logs an event with description, url, and title when window and document are defined', () => {
      const mockDescription = 'Test Event'
      const mockPathname = '/myrac'
      const mockTitle = 'Example Page Title'

      jest.spyOn(global, 'window', 'get').mockReturnValue({
        location: { pathname: mockPathname }
      } as any)
      jest.spyOn(global, 'document', 'get').mockReturnValue({
        title: mockTitle
      } as any)

      logEvent(mockDescription)

      expect(event).toHaveBeenCalledWith(mockDescription, {
        url: mockPathname,
        title: mockTitle
      })
      expect(gtm).toHaveBeenCalled()

      jest.restoreAllMocks()
    })

    it('does not log if window or document is undefined', () => {
      jest.spyOn(global, 'window', 'get').mockReturnValue(undefined as any)
      jest.spyOn(global, 'document', 'get').mockReturnValue(undefined as any)

      logEvent('Test Event')

      expect(event).not.toHaveBeenCalled()
      expect(gtm).not.toHaveBeenCalled()

      jest.restoreAllMocks()
    })
  })

  describe('logFieldTouched', () => {
    it('logs a field touched with description, url, and title when window and document are defined', () => {
      const mockDescription = 'Field Touched'
      const mockPathname = '/myrac'
      const mockTitle = 'Example Page Title'

      jest.spyOn(global, 'window', 'get').mockReturnValue({
        location: { pathname: mockPathname }
      } as any)
      jest.spyOn(global, 'document', 'get').mockReturnValue({
        title: mockTitle
      } as any)

      logFieldTouched(mockDescription)

      expect(fieldTouched).toHaveBeenCalledWith(mockDescription, {
        url: mockPathname,
        title: mockTitle
      })
      expect(gtm).toHaveBeenCalled()

      jest.restoreAllMocks()
    })

    it('does not log if window or document is undefined', () => {
      jest.spyOn(global, 'window', 'get').mockReturnValue(undefined as any)
      jest.spyOn(global, 'document', 'get').mockReturnValue(undefined as any)

      logFieldTouched('Field Touched')

      expect(fieldTouched).not.toHaveBeenCalled()
      expect(gtm).not.toHaveBeenCalled()

      jest.restoreAllMocks()
    })
  })

  describe('logPageView', () => {
    it('logs a virtual page view with url and title when window and document are defined', () => {
      const mockPathname = '/myrac'
      const mockTitle = 'Example Page Title'

      jest.spyOn(global, 'window', 'get').mockReturnValue({
        location: { pathname: mockPathname }
      } as any)
      jest.spyOn(global, 'document', 'get').mockReturnValue({
        title: mockTitle
      } as any)

      logPageView()

      expect(virtualPageView).toHaveBeenCalledWith({
        url: mockPathname,
        title: mockTitle
      })
      expect(gtm).toHaveBeenCalled()

      jest.restoreAllMocks()
    })

    it('does not log if window or document is undefined', () => {
      jest.spyOn(global, 'window', 'get').mockReturnValue(undefined as any)
      jest.spyOn(global, 'document', 'get').mockReturnValue(undefined as any)

      logPageView()

      expect(virtualPageView).not.toHaveBeenCalled()
      expect(gtm).not.toHaveBeenCalled()

      jest.restoreAllMocks()
    })
  })
})
