import { getComponent } from '@/graphql/getComponent';
import Banner from './Banner';
import { createTheme, ThemeProvider } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { themeOptions } from '@racwa/react-components';
import { type BannerProps } from '@/types/cmsTypes/BannerProps';
import { BLOCKS } from '@contentful/rich-text-types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCertificate } from '@fortawesome/free-solid-svg-icons';
library.add(faCertificate);

jest.mock('../../../graphql/getComponent', () => ({
  getComponent: jest.fn()
}));
jest.mock('../../../utilities/getAccessToken', () => jest.fn());

const mockBannerData: BannerProps = {
  bannerImage: [],
  heading: {
    json: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Banner text',
              marks: [],
              data: {}
            }
          ]
        }
      ]
    }
  },
  links: {
    items: [
      {
        longText: 'Get a quote',
        shortText: 'Quote',
        link: '#',
        icon: 'certificate',
        variant: 'Icon CTA'
      }
    ]
  }
};

describe('Banner', () => {
  it('no data returns null', async () => {
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(null));
    const result = await Banner({ data: { sys: { id: '1' } } });
    expect(result).toBeNull();
  });
  it('renders data', async () => {
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(mockBannerData));
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>{await Banner({ data: { sys: { id: '1' } } })}</ThemeProvider>
    );
    // TODO: Add background image check
    expect(screen.getByText('Banner text')).toBeInTheDocument(); // Banner text
    expect(screen.getByRole('link', { name: 'Get a quote' })).toBeInTheDocument(); // Top link
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument(); // Top link icon
  });
});
