import { render, screen, waitFor } from '@testing-library/react';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import DigitalCard, { type DigitalCardProps } from './DigitalCard';
import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';
import { ModalProvider } from '../Modal/ModalProvider';
import { testHelper } from '@/__tests__/helpers/testHelpers';

library.add(fas);

const mockedCardDetails: DigitalCardDetails = {
  isSuccess: true,
  value: {
    digitalCardPassId: '12345',
    digitalCardPassIsActive: true,
    digitalCardPassUrl: 'https://digital-card-link',
    numberOfPassesInstalled: 0
  },
  errors: null
};

const props: DigitalCardProps = {
  person: {
    title: 'Mr',
    firstName: 'John',
    surname: 'Doe',
    tier: 'Blue',
    cardColour: 'Blue',
    racId: '12345678',
    membershipCardNumber: '1234567890123456'
  },
  cardDetails: mockedCardDetails
};

const getItemMock = jest.fn();
const setItemMock = jest.fn();
Storage.prototype.getItem = getItemMock;
Storage.prototype.setItem = setItemMock;

jest.mock('../Hooks/useDeviceDetection');

jest.mock('../../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn()
}));

describe('DigitalCard', () => {
  it('renders the card with correct details', async () => {
    testHelper.mockDesktopDevice();
    const result = render(
      <ModalProvider>
        <DigitalCard {...props} />
      </ModalProvider>
    );

    expect(screen.getByText('Digital card')).toBeVisible();
    expect(result.container.querySelector('.fa-eye')).toBeVisible();
  });

  it('clicks the image should show desktop modal and can close it', async () => {
    testHelper.mockDesktopDevice();
    render(
      <ModalProvider>
        <DigitalCard {...props} />
      </ModalProvider>
    );

    await testHelper.clickText('Digital card', screen);
    expect(screen.getByText('Get your digital card now')).toBeVisible();
    testHelper.verifyEventLogged('Digital card desktop modal');
    await testHelper.clickButton('close', screen);
    testHelper.verifyEventLogged('Digital card desktop modal - Close');
  });

  it('clicks the image should show mobile modal and can close it', async () => {
    testHelper.mockMobileDevice();
    render(
      <ModalProvider>
        <DigitalCard {...props} />
      </ModalProvider>
    );

    await testHelper.clickText('Digital card', screen);
    expect(screen.getByText('Your digital card')).toBeVisible();
    testHelper.verifyEventLogged('Digital card mobile modal');
    await testHelper.clickButton('close', screen);
    testHelper.verifyEventLogged('Digital card mobile modal - Close');
  });

  it('should display a promotional tooltip on first login', async () => {
    testHelper.mockDesktopDevice();
    getItemMock.mockReturnValueOnce(undefined);

    render(
      <ModalProvider>
        <DigitalCard {...props} storageKey='test' />
      </ModalProvider>
    );

    expect(getItemMock).toHaveBeenCalled();
    expect(screen.getByText('Add card to your mobile wallet')).toBeVisible();
  });

  it('should display a promotional tooltip on second login', async () => {
    testHelper.mockDesktopDevice();
    getItemMock.mockReturnValueOnce(JSON.stringify({ count: 1, lastShown: 'someotherday' }));

    render(
      <ModalProvider>
        <DigitalCard {...props} storageKey='test' />
      </ModalProvider>
    );

    expect(getItemMock).toHaveBeenCalled();
    expect(screen.getByText('Add card to your mobile wallet')).toBeVisible();
  });

  it("shouldn't display a promotional tooltip on third login", async () => {
    testHelper.mockDesktopDevice();
    getItemMock.mockReturnValueOnce(JSON.stringify({ count: 2, lastShown: 'someotherday' }));

    render(
      <ModalProvider>
        <DigitalCard {...props} storageKey='test' />
      </ModalProvider>
    );

    expect(getItemMock).toHaveBeenCalled();
    expect(screen.queryByText('Add card to your mobile wallet')).toBeNull();
  });

  it("shouldn't display a promotional tooltip if already seen it today", async () => {
    testHelper.mockDesktopDevice();
    getItemMock.mockReturnValueOnce(JSON.stringify({ count: 1, lastShown: new Date().toDateString() }));

    render(
      <ModalProvider>
        <DigitalCard {...props} storageKey='test' />
      </ModalProvider>
    );

    expect(getItemMock).toHaveBeenCalled();
    expect(screen.queryByText('Add card to your mobile wallet')).toBeNull();
  });

  it("shouldn't display a promotional tooltip if error parsing", async () => {
    testHelper.mockDesktopDevice();
    getItemMock.mockReturnValueOnce('invalid json');

    render(
      <ModalProvider>
        <DigitalCard {...props} storageKey='test' />
      </ModalProvider>
    );

    expect(getItemMock).toHaveBeenCalled();
    expect(screen.queryByText('Add card to your mobile wallet')).toBeNull();
  });

  it('should close promotional tooltip when close button clicked', async () => {
    testHelper.mockDesktopDevice();
    getItemMock.mockReturnValueOnce(undefined);

    render(
      <ModalProvider>
        <DigitalCard {...props} storageKey='test' />
      </ModalProvider>
    );

    expect(getItemMock).toHaveBeenCalled();
    expect(screen.getByText('Add card to your mobile wallet')).toBeVisible();
    await testHelper.clickButton('', screen);
    expect(setItemMock).toHaveBeenCalledWith(
      'test',
      JSON.stringify({ count: 1, lastShown: new Date().toDateString() })
    );
    await waitFor(() => {
      expect(screen.queryByText('Add card to your mobile wallet')).toBeNull();
    });
  });

  it('should close promotional tooltip when modal opened', async () => {
    testHelper.mockDesktopDevice();
    getItemMock.mockReturnValueOnce(undefined);

    render(
      <ModalProvider>
        <DigitalCard {...props} storageKey='test' />
      </ModalProvider>
    );

    expect(getItemMock).toHaveBeenCalled();
    expect(screen.getByText('Add card to your mobile wallet')).toBeVisible();
    await testHelper.clickText('Digital card', screen);
    expect(setItemMock).toHaveBeenCalledWith(
      'test',
      JSON.stringify({ count: 1, lastShown: new Date().toDateString() })
    );
    await waitFor(() => {
      expect(screen.queryByText('Add card to your mobile wallet')).toBeNull();
    });
    expect(screen.getByText('Get your digital card now')).toBeVisible();
  });
});
