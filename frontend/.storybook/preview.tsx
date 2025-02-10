import type { Preview } from '@storybook/react';
import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { MyRACThemeProvider } from '../theme';
library.add(fas);
library.add(fab);

const preview: Preview = {
  decorators: [
    (Story) => (
      <MyRACThemeProvider>
        <Story />
      </MyRACThemeProvider>
    )
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    chromatic: { viewports: [375, 760, 1440] },
    nextjs: {
      appDirectory: true // this is for mocking of next/navigation
    },
    viewport: {
      viewports: {
        extraSmall: {
          name: 'Extra Small',
          styles: {
            width: '375px',
            height: '812px'
          }
        },
        small: {
          name: 'Small',
          styles: {
            width: '600px',
            height: '800px'
          }
        },
        medium: {
          name: 'Medium',
          styles: {
            width: '800px',
            height: '900px'
          }
        },
        large: {
          name: 'Large',
          styles: {
            width: '1440px',
            height: '1024px'
          }
        },
        extraLarge: {
          name: 'Extra Large',
          styles: {
            width: '1920',
            height: '1080px'
          }
        }
      }
    }
  }
};

export default preview;
