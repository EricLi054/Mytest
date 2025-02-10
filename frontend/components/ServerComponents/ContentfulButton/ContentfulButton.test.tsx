import { render, screen } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material';
import { themeOptions } from '@racwa/react-components';
import { getComponent } from '@/graphql/getComponent';
import ContentfulButton from './ContentfulButton';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import userEvent from '@testing-library/user-event';
import { logEvent } from '@/utilities/analyticsTagging';

library.add(faShoppingCart);

jest.mock('../../../graphql/getComponent', () => ({
  getComponent: jest.fn()
}));
jest.mock('../../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn()
}));

const regularButton = {
  longText: 'Regular Button',
  link: '/'
};

const imageButton = {
  longText: 'Image Button',
  link: '/',
  image: {
    publicId: '/image'
  },
  variant: 'Image'
};

const iconButton = {
  longText: 'Icon Button',
  link: '/',
  icon: 'shopping-cart',
  variant: 'Icon CTA'
};

const transparentButton = {
  longText: 'Transparent Button',
  link: '/',
  variant: 'CTA Transparent'
};

const chevronButton = {
  longText: 'Chevron Button',
  link: '/',
  variant: 'Chevron'
};

describe('Contentful Button', () => {
  it('no data returns null', async () => {
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(null));
    const result = await ContentfulButton({ data: { sys: { id: '1' } } });
    expect(result).toBeNull();
  });
  it('renders a regular button', async () => {
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(regularButton));
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        {await ContentfulButton({ data: { sys: { id: '1' } } })}
      </ThemeProvider>
    );
    const button = screen.getByText('Regular Button');
    await userEvent.click(button);
    expect(jest.mocked(logEvent)).toHaveBeenCalled();
  });
  it('renders an image button', async () => {
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(imageButton));
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        {await ContentfulButton({ data: { sys: { id: '1' } } })}
      </ThemeProvider>
    );
    const button = screen.getByText('Image Button');
    // test image is there
    await userEvent.click(button);
    expect(jest.mocked(logEvent)).toHaveBeenCalled();
  });
  it('renders an icon button', async () => {
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(iconButton));
    const result = render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        {await ContentfulButton({ data: { sys: { id: '1' } } })}
      </ThemeProvider>
    );
    const button = screen.getByText('Icon Button');
    const icon = result.container.querySelector('.fa-cart-shopping');
    expect(icon).toBeVisible();
    await userEvent.click(button);
    expect(jest.mocked(logEvent)).toHaveBeenCalled();
  });
  it('renders an transparent button', async () => {
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(transparentButton));
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        {await ContentfulButton({ data: { sys: { id: '1' } } })}
      </ThemeProvider>
    );
    const button = screen.getByText('Transparent Button');
    await userEvent.click(button);
    expect(jest.mocked(logEvent)).toHaveBeenCalled();
  });
  it('renders an chevron button', async () => {
    jest.mocked(getComponent).mockReturnValueOnce(Promise.resolve(chevronButton));
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        {await ContentfulButton({ data: { sys: { id: '1' } } })}
      </ThemeProvider>
    );
    const button = screen.getByText('Chevron Button');
    const chevron = screen.getByTestId('ChevronRightIcon');
    expect(chevron).toBeVisible();
    await userEvent.click(button);
    expect(jest.mocked(logEvent)).toHaveBeenCalled();
  });
});
