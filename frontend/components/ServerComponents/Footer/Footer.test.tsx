import { getComponent } from '@/graphql/getComponent';
import Footer from './Footer';
import { footerContentfulData } from '@/__tests__/mockData/footer';
import { render, screen } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material';
import { themeOptions } from '@racwa/react-components';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebookSquare, faInstagram, faLinkedinIn, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { testHelper } from '@/__tests__/helpers/testHelpers';
library.add(faFacebookSquare);
library.add(faInstagram);
library.add(faTwitter);
library.add(faLinkedinIn);

testHelper.mockConsole();

jest.mock('../../../graphql/getComponent', () => ({
  getComponent: jest.fn()
}));
jest.mock('../../../utilities/getAccessToken', () => jest.fn());
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => {
    return {
      push: pushMock
    };
  }
}));

describe('Footer', () => {
  it('no data returns null', async () => {
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(null));
    const result = await Footer({ data: { sys: { id: '1' } } });
    expect(result).toBeNull();
  });
  it('renders data', async () => {
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(footerContentfulData));
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>{await Footer({ data: { sys: { id: '1' } } })}</ThemeProvider>
    );
    expect(screen.getByText('Search')).toBeInTheDocument(); // search bar
    expect(screen.getByText('Information & advice')).toBeInTheDocument(); // footer sitemap
    expect(screen.getByText('Privacy')).toBeInTheDocument(); // footer links
    expect(screen.getByRole('link', { name: 'RAC on Facebook' })).toBeInTheDocument(); // footer social links
    expect(screen.getByText('Footer text')).toBeInTheDocument(); // footer description
  });
});
