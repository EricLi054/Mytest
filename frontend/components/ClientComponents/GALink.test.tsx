import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import { themeOptions } from '@racwa/react-components';
import { testHelper } from '@/__tests__/helpers/testHelpers';
import { GALink } from './GALink';

jest.mock('../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn(),
  logFieldTouched: jest.fn()
}));

describe('ReturnLink', () => {
  it('renders the link', async () => {
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <GALink longLinkText='Click here to continue' href='' />
      </ThemeProvider>
    );

    const title = screen.getByText('Click here to continue');
    expect(title).toBeInTheDocument();
  });

  it('clicks the link triggers GA event', async () => {
    const linkText = 'myRAC home';
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <GALink longLinkText={linkText} href={'/myRAC'} googleAnalyticsDescription='Return to myRAC' />
      </ThemeProvider>
    );

    await testHelper.clickLink(linkText, screen);
    testHelper.verifyEventLogged('Return to myRAC');
  });
});
