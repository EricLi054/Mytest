import { render, screen } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material';
import { themeOptions } from '@racwa/react-components';
import { getComponent } from '@/graphql/getComponent';
import ContentfulLink from './ContentfulLink';

jest.mock('../../graphql/getComponent', () => ({
  getComponent: jest.fn()
}));

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

const regularLink = {
  longLinkText: 'Click me...',
  linkUrl: '/'
};

describe('Contentful Link', () => {
  it('renders a link', async () => {
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(regularLink));
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        {await ContentfulLink({ data: { sys: { id: '1', linkUrl: '/' } } })}
      </ThemeProvider>
    );
    expect(screen.getByText('Click me...')).toBeInTheDocument();
  });
});
