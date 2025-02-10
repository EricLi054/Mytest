import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import { themeOptions } from '@racwa/react-components';
import { ReturnLink } from './ReturnLink';
import { errorPage } from '@/utilities/errorPage';
import { testHelper } from '@/__tests__/helpers/testHelpers';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

const useSearchParamsMock = jest.fn();
const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useSearchParams: () => {
    return {
      get: useSearchParamsMock
    };
  },
  useRouter: () => {
    return {
      push: pushMock
    };
  }
}));

jest.mock('../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn(),
  logFieldTouched: jest.fn()
}));

describe('ReturnLink', () => {
  beforeEach(() => {
    useSearchParamsMock.mockClear();
  });

  it('renders the link', async () => {
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <ReturnLink longLinkText='Click here to continue' linkUrl='' />
      </ThemeProvider>
    );

    const title = screen.getByText('Click here to continue');
    expect(title).toBeInTheDocument();
    expect(useSearchParamsMock).toHaveBeenCalledTimes(1);
  });

  it('redirect to error page when unhandled error occurred', async () => {
    const returnUrl = 'invalid url';
    useSearchParamsMock.mockReturnValueOnce(returnUrl);

    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <ReturnLink longLinkText='Click here to continue' linkUrl='' />
      </ThemeProvider>
    );
    expect(pushMock).toHaveBeenCalledWith(errorPage.somethingWentWrong);
  });

  it('returns to the searchParams url', async () => {
    const returnUrl = 'https://google.com';
    useSearchParamsMock.mockReturnValueOnce(returnUrl);

    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <ReturnLink longLinkText='Click here to continue' linkUrl='' />
      </ThemeProvider>
    );

    expect(screen.getByRole('link', { name: 'Click here to continue' })).toHaveAttribute('href', 'https://google.com/');
  });

  it('renders the link from props when no return_url in searchParams', async () => {
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <ReturnLink longLinkText='Click here to continue' linkUrl='https://google.com/' />
      </ThemeProvider>
    );

    expect(screen.getByRole('link', { name: 'Click here to continue' })).toHaveAttribute('href', 'https://google.com/');
  });

  it('always renders the return_url link with protocol', async () => {
    const returnUrl = 'google.com';
    useSearchParamsMock.mockReturnValueOnce(returnUrl);

    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <ReturnLink longLinkText='Click here to continue' linkUrl='' />
      </ThemeProvider>
    );

    expect(screen.getByRole('link', { name: 'Click here to continue' })).toHaveAttribute('href', 'https://google.com/');
  });

  it('clicks the link triggers GA event', async () => {
    const linkText = 'myRAC home';
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <ReturnLink longLinkText={linkText} linkUrl={'/myRAC'} />
      </ThemeProvider>
    );

    await testHelper.clickLink(linkText, screen);
    testHelper.verifyEventLogged(`Back to ${linkText}`);
  });
});
