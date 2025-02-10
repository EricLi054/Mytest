import { fireEvent, render, screen } from '@testing-library/react';
import ResponsiveHeader from '@/components/ClientComponents/ResponsiveHeader';
import { RacwaThemeProvider } from '@racwa/react-components';
import { useSession } from 'next-auth/react';
import { topNavProps, megaNavMenuData } from '@/__tests__/mockData/megaNav';
import mediaQuery from 'css-mediaquery';
import 'jest-location-mock';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faSearch, faUser, faChevronUp, faPhone } from '@fortawesome/free-solid-svg-icons';
import { testHelper } from '@/__tests__/helpers/testHelpers';

jest.mock('../../utilities/analyticsTagging', () => ({
  logNavClick: jest.fn()
}));

library.add(faSearch);
library.add(faChevronDown);
library.add(faUser);
library.add(faChevronUp);
library.add(faPhone);

const baseUrl = 'http://localhost';

// TODO: Move to test utils folder and exclude from coverage
const createMatchMedia = (width: number) => {
  return (query: string): MediaQueryList => ({
    matches: mediaQuery.match(query, { width }),
    media: '',
    addListener: () => {},
    removeListener: () => {},
    onchange: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true
  });
};

jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: { email: 'test-email@test.com' }
};

jest.mocked(useSession).mockReturnValue({
  data: mockSession,
  status: 'authenticated',
  update: jest.fn()
});

describe('ResponsiveHeader', () => {
  const { getComputedStyle: originalGetComputedStyle, matchMedia: originalMatchMedia } = window;

  beforeAll(() => {
    // Required as JSDom does not fully support getComputedStyle
    window.getComputedStyle = jest.fn().mockReturnValue({
      getPropertyValue: jest.fn().mockReturnValue('5px')
    });

    // Required for media queries to work - setting width to 1024px (Desktop View)
    window.matchMedia = createMatchMedia(1024);
  });

  afterAll(() => {
    window.getComputedStyle = originalGetComputedStyle;
    window.matchMedia = originalMatchMedia;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should navigate home when RAC Logo is clicked', async () => {
    window.location.assign('/myrac');
    expect(window.location.href).toBe(new URL('myrac', baseUrl).href);

    render(
      <RacwaThemeProvider>
        <ResponsiveHeader navigation={topNavProps} megaNavData={megaNavMenuData} fullName={'Joe Bloggs'} />
      </RacwaThemeProvider>
    );

    const racLogo = await screen.findByAltText('logo');
    expect(racLogo).toBeVisible();
    fireEvent.click(racLogo);
    expect(window.location.href).toBe(new URL('/', baseUrl).href);
  });

  test('Should display mobile search bar when search button is clicked and viewport is less than 1024px', async () => {
    window.matchMedia = createMatchMedia(1023); // Test Mobile trigger point

    render(
      <RacwaThemeProvider>
        <ResponsiveHeader navigation={topNavProps} megaNavData={megaNavMenuData} fullName={'Joe Bloggs'} />
      </RacwaThemeProvider>
    );

    const mobileSearchButton = await screen.findByTestId('mobile-search-button');
    expect(mobileSearchButton).toBeVisible();
    fireEvent.click(mobileSearchButton);
    const mobileSearchBar = await screen.findByPlaceholderText('Search');
    expect(mobileSearchBar).toBeVisible();
  });

  test('Should trigger GA navClick event when clicked', async () => {
    render(
      <RacwaThemeProvider>
        <ResponsiveHeader navigation={topNavProps} megaNavData={megaNavMenuData} fullName={'Joe Bloggs'} />
      </RacwaThemeProvider>
    );

    await testHelper.clickButton('More', screen);
    testHelper.verifyNavClickLogged('More chevron - Open');

    await testHelper.clickButton('More', screen);
    testHelper.verifyNavClickLogged('More chevron - Close');

    await testHelper.clickButton('More', screen);

    await testHelper.clickTestId('member-card-yellow-image', screen);
    testHelper.verifyNavClickLogged('myRAC - Digital card icon');

    await testHelper.clickTestId('member-full-name-typography', screen);
    testHelper.verifyNavClickLogged('myRAC - Full name');

    await testHelper.clickLink('User menu Link 1', screen);
    testHelper.verifyNavClickLogged('User menu Link 1');
  });
});
