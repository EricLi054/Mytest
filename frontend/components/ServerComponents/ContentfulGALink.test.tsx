import { render, screen } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material';
import { themeOptions } from '@racwa/react-components';
import { getComponent } from '@/graphql/getComponent';
import ContentfulGALink from './ContentfulGALink';

jest.mock('../../graphql/getComponent', () => ({
  getComponent: jest.fn()
}));

const regularLink = {
  longLinkText: 'Return to myRAC',
  linkUrl: '/myRAC',
  googleAnalyticsDescription: 'Return to myRAC'
};

describe('Contentful GA Link', () => {
  it('renders a link', async () => {
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(regularLink));
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        {await ContentfulGALink({ data: { sys: { id: '1' } } })}
      </ThemeProvider>
    );
    expect(screen.getByText('Return to myRAC')).toBeInTheDocument();
  });
});
