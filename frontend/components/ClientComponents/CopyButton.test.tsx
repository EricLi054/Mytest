import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CopyButton, { TOOLTIP_TIMEOUT_INTERVAL_SECONDS } from './CopyButton';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { testHelper } from '@/__tests__/helpers/testHelpers';

library.add(fas);
userEvent.setup();

jest.mock('../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn(),
  logFieldTouched: jest.fn()
}));

describe('CopyButton', () => {
  it('should be rendered', async () => {
    render(<CopyButton text={undefined} />);

    const copyButton = screen.getByRole('button', {
      name: 'copy to clipboard'
    });

    expect(copyButton).not.toBe(null);
  });

  it('should copy text to clipboard when clicked', async () => {
    render(<CopyButton text='copy me please' />);

    const copyButton = screen.getByRole('button', {
      name: 'copy to clipboard'
    });

    await act(async () => {
      await userEvent.click(copyButton);
    });

    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe('copy me please');
  });

  it('should show tooltip when clicked', async () => {
    render(<CopyButton text='copy me please' />);

    const copyButton = screen.getByRole('button', {
      name: 'copy to clipboard'
    });

    await act(async () => {
      await userEvent.click(copyButton);
    });

    const tooltip = screen.getByText('Copied!');
    expect(tooltip).toBeVisible();
  });

  it('should hide tooltip after timing out', async () => {
    // user-event adds a delay between some subsequent inputs.
    // When using fake timers it is necessary to set this option
    // to your test runner's time advancement function.
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    jest.useFakeTimers();

    render(
      <div>
        <CopyButton text='copy me please' />
      </div>
    );

    const copyButton = screen.getByRole('button', {
      name: 'copy to clipboard'
    });

    await act(async () => {
      await user.click(copyButton);
    });

    const tooltip = screen.getByText('Copied!');
    expect(tooltip).toBeVisible();

    act(() => {
      jest.advanceTimersByTime(TOOLTIP_TIMEOUT_INTERVAL_SECONDS * 2 * 1000);
    });

    await waitFor(() => {
      expect(screen.getByText('Copied!')).not.toBeVisible();
    });

    jest.useRealTimers();
  });

  it('clicks the copy button triggers GA event', async () => {
    render(
      <div>
        <CopyButton text='copy me please' />
      </div>
    );
    await testHelper.clickButton('copy to clipboard', screen);
    testHelper.verifyEventLogged('Digital card - Copy member number');
  });
});
