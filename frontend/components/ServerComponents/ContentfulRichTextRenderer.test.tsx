import ContentfulRichTextRenderer from '@/components/ServerComponents/ContentfulRichTextRenderer';
import { type ContentfulRichTextRendererProps } from '@/types/cmsTypes/ContentfulRichTextRendererProps';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { createTheme, ThemeProvider } from '@mui/material';
import { themeOptions } from '@racwa/react-components';
import { render, screen } from '@testing-library/react';

jest.mock('../../utilities/getAccessToken', () => ({
  getAccessToken: () => jest.fn()
}));

const validRichText: ContentfulRichTextRendererProps = {
  text: {
    json: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.HEADING_2,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Profile',
              marks: [],
              data: {}
            }
          ]
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: '',
              marks: [],
              data: {}
            },
            {
              nodeType: INLINES.EMBEDDED_ENTRY,
              data: {
                target: {
                  sys: {
                    id: '4X0x2HTfNuF2GVdNF3Fbqg',
                    type: 'Link',
                    linkType: 'Entry'
                  }
                }
              },
              content: []
            }
          ]
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: '',
              marks: [],
              data: {}
            },
            {
              nodeType: INLINES.EMBEDDED_ENTRY,
              data: {
                target: {
                  sys: {
                    id: '46hGx2HTfNuF2HTOPAAW21q',
                    type: 'MustacheTemplates',
                    linkType: 'Entry'
                  }
                }
              },
              content: []
            }
          ]
        }
      ]
    },
    links: {
      entries: {
        inline: [
          {
            __typename: 'Link',
            sys: {
              id: '4X0x2HTfNuF2GVdNF3Fbqg'
            }
          },
          {
            __typename: 'MustacheTemplates',
            sys: {
              id: '46hGx2HTfNuF2HTOPAAW21q'
            }
          },
          {
            __typename: 'NotMapped',
            sys: {
              id: 'na'
            }
          }
        ]
      }
    }
  }
};

jest.mock('./ContentfulLink', () => {
  const ContentfulLink = (props: { data: any }) => <>{props.data.sys.id}</>;
  return ContentfulLink;
});

jest.mock('./Mustache', () => {
  const ContentfulLink = (props: { data: any }) => <>{props.data.sys.id}</>;
  return ContentfulLink;
});

describe('ContentfulRichTextRenderer', () => {
  it('renders rich text for valid json', async () => {
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <>{ContentfulRichTextRenderer(validRichText)}</>
      </ThemeProvider>
    );

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('4X0x2HTfNuF2GVdNF3Fbqg')).toBeInTheDocument();
    expect(screen.getByText('46hGx2HTfNuF2HTOPAAW21q')).toBeInTheDocument();
  });

  it('invalid json throws error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    ContentfulRichTextRenderer({} as any);
    expect(console.error).toHaveBeenCalledWith(
      'Error: ContentfulRichTextRenderer.tsx - Error rendering rich text',
      new Error('Invalid text prop')
    );
  });
});
