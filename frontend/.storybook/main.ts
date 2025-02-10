import type { StorybookConfig } from '@storybook/nextjs';
const config: StorybookConfig = {
  stories: ['../__stories__/**/*.mdx', '../__stories__/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-useragent',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
        babelOptions: {},
        sourceLoaderOptions: null,
        transcludeMarkdown: false
      }
    }
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  core: {
    disableTelemetry: true
  },
  env: (config) => ({
    ...config,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: 'dltdv24vg'
  }),
  webpackFinal: async (config, options) => {
    // @ts-expect-error workaround to improve stability of hot reloads
    if (options.cache) options.cache.set = () => Promise.resolve();
    return config;
  }
};
export default config;
