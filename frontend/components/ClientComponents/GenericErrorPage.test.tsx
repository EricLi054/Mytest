import React from 'react';
import { render, screen } from '@testing-library/react';
import GenericErrorPage from './GenericErrorPage';
import { themeOptions } from '@racwa/react-components';
import { ThemeProvider, createTheme } from '@mui/material';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import userEvent from '@testing-library/user-event';
import { logEvent } from '@/utilities/analyticsTagging';

library.add(faPhone);

jest.mock('../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn()
}));

describe('GenericErrorPage', () => {
  test('renders error page heading and message', () => {
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <GenericErrorPage />
      </ThemeProvider>
    );

    // Check if "Uh oh!" heading is rendered
    const headingElement = screen.getByText(/Uh oh!/i);
    expect(headingElement).toBeInTheDocument();

    // Check if error message is rendered
    const errorMessageElement = screen.getByText(/Something went wrong/i);
    expect(errorMessageElement).toBeInTheDocument();
  });

  test('renders phone number button with correct href', async () => {
    render(
      <ThemeProvider theme={createTheme(themeOptions)}>
        <GenericErrorPage />
      </ThemeProvider>
    );

    // Check if phone number button is rendered
    const phoneButton = screen.getByRole('link', { name: '13 17 03' });
    expect(phoneButton).toBeInTheDocument();

    // Check if button has correct href
    expect(phoneButton).toHaveAttribute('href', 'tel:131703');

    await userEvent.click(phoneButton);
    expect(jest.mocked(logEvent)).toHaveBeenCalledTimes(1);
  });
});
