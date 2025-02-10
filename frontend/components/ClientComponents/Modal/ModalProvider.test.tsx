import { act, render, screen, waitFor } from '@testing-library/react';
import { ModalProvider } from './ModalProvider';
import { useModalContext } from './ModalContext';
import { Button } from '@mui/material';
import userEvent from '@testing-library/user-event';
import { testHelper } from '@/__tests__/helpers/testHelpers';

jest.mock('../../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn()
}));

const TestButton = () => {
  const { openModal, closeModal } = useModalContext();

  return (
    <Button
      onClick={() => {
        openModal('Test Modal Title', <div>Test Modal Body</div>, closeModal);
      }}
    >
      Open
    </Button>
  );
};

describe('Global Modal', () => {
  it('should not work when not wrapped in provider', async () => {
    render(
      <>
        <TestButton />
      </>
    );
    const openButton = screen.getByRole('button', { name: 'Open' });
    await act(async () => {
      await userEvent.click(openButton);
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('should render in a closed state', async () => {
    render(
      <ModalProvider>
        <TestButton />
      </ModalProvider>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('should open a modal with specific content', async () => {
    render(
      <ModalProvider>
        <TestButton />
      </ModalProvider>
    );
    await testHelper.clickButton('Open', screen);
    expect(screen.getByRole('dialog', { name: 'Test Modal Title' })).toBeInTheDocument();
  });
  it('should open and close a modal', async () => {
    render(
      <ModalProvider>
        <TestButton />
      </ModalProvider>
    );
    const openButton = screen.getByRole('button', { name: 'Open' });
    await act(async () => {
      await userEvent.click(openButton);
    });
    expect(screen.getByRole('dialog', { name: 'Test Modal Title' })).toBeInTheDocument();
    await testHelper.clickButton('close', screen);
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Test Modal Title' })).not.toBeInTheDocument();
    });
  });
});
