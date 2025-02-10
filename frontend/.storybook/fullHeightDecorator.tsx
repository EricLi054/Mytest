import React, { useEffect } from 'react';
import { StoryFn } from '@storybook/react';

export const injectFullHeightStyle = () => {
  const css = `html, body, #storybook-root, #storybook-root > div { height: 100% }`;
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  head.appendChild(style);
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
};

export const FullHeight = (Story: StoryFn) => {
  useEffect(() => {
    injectFullHeightStyle();
  }, []);
  return <Story />;
};

export default FullHeight;
