import StandardErrorPage from '@/app/[...slug]/StandardErrorPage';
import { MyRACThemeProvider } from '@/theme';
import { render, screen } from '@testing-library/react';

jest.mock('../../components/ServerComponents/ContentfulRichTextRenderer', () => {
  const ContentfulRichTextRenderer = ({ text }: { text: any }) => <div>{text?.json?.text}</div>;
  return ContentfulRichTextRenderer;
});

const mockData = {
  data: {
    page: {
      items: [
        {
          heading: 'Heading',
          subHeading: 'Sub Heading',

          content: {
            json: { text: 'Rich Text' },
            links: {}
          }
        }
      ]
    }
  }
};

describe('Standard Error Page', () => {
  it('renders a loading modal', async () => {
    const params: Readonly<{ pageData: any | undefined }> = {
      pageData: undefined
    };
    render(
      <MyRACThemeProvider>
        <>{await StandardErrorPage(params)}</>
      </MyRACThemeProvider>
    );

    // finds loading spinner image
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });
  it('renders content', async () => {
    const params: Readonly<{ pageData: any | undefined }> = {
      pageData: mockData.data.page.items[0]
    };
    render(
      <MyRACThemeProvider>
        <>{await StandardErrorPage(params)}</>
      </MyRACThemeProvider>
    );
    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.getByText('Sub Heading')).toBeInTheDocument();
    expect(screen.getByText('Rich Text')).toBeInTheDocument();
  });
});
