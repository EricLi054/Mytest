import { render, screen } from '@testing-library/react';
import CardRequestForm from '@/components/ClientComponents/CardRequestForm';
import requestPhysicalCardHandler from '@/components/DataDrivenForm/handlers/requestPhysicalCardHandler';
import userEvent from '@testing-library/user-event';
import { type PersonAddress } from '@/types/backendTypes/personAddress';
import { testHelper } from '@/__tests__/helpers/testHelpers';

jest.mock('../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn(),
  logFieldTouched: jest.fn()
}));

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => {
    return {
      push: pushMock
    };
  }
}));

const unhandledErrorResponse = {
  ok: false,
  data: {
    physicalCardResponse: undefined,
    errors: [
      {
        errorCode: 'Unauthorized',
        message: 'Unauthorized'
      }
    ]
  }
};

const cardAlreadyOrderedError = {
  ok: false,
  data: {
    physicalCardResponse: undefined,
    errors: [
      {
        errorCode: 'BadRequest',
        message: 'Bad Request'
      }
    ]
  }
};

const successResponse = {
  ok: true,
  data: {
    physicalCardResponse: {
      value: 'Physical card request successful',
      isSuccess: true,
      errors: []
    }
  }
};

jest.mock('../DataDrivenForm/handlers/requestPhysicalCardHandler', () => jest.fn());
const submitHandlerMock = jest.mocked(requestPhysicalCardHandler).mockReturnValue(Promise.resolve(successResponse));

const mockUnmaskedAddress: PersonAddress = {
  formattedAddress: '123 Fake St'
};

describe('CardRequestForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page with correct member address', async () => {
    render(<CardRequestForm unmaskedAddress={mockUnmaskedAddress} />);

    expect(screen.getByText('123 Fake St')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Request card' })).toBeVisible();
  });

  it('submitting card request with success response navigates to success page', async () => {
    render(<CardRequestForm unmaskedAddress={mockUnmaskedAddress} />);

    const button = screen.getByRole('button', { name: 'Request card' });
    await userEvent.click(button);

    expect(submitHandlerMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/myrac/profile/membership/request-a-card/card-request-sent');
  });

  it('submitting card request with unhandled error response navigates to error page', async () => {
    jest.mocked(requestPhysicalCardHandler).mockReturnValue(Promise.resolve(unhandledErrorResponse));

    render(<CardRequestForm unmaskedAddress={mockUnmaskedAddress} />);

    const button = screen.getByRole('button', { name: 'Request card' });
    await userEvent.click(button);

    expect(submitHandlerMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/error');
  });

  it('submitting duplicate card request navigates to duplicate-card-error page', async () => {
    jest.mocked(requestPhysicalCardHandler).mockReturnValue(Promise.resolve(cardAlreadyOrderedError));

    render(<CardRequestForm unmaskedAddress={mockUnmaskedAddress} />);

    const button = screen.getByRole('button', { name: 'Request card' });
    await userEvent.click(button);

    expect(submitHandlerMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/myrac/profile/membership/request-a-card/card-already-requested');
  });

  it('clicking update contact details link triggers GA event', async () => {
    render(<CardRequestForm unmaskedAddress={mockUnmaskedAddress} />);

    await testHelper.clickText('contact details', screen);
    testHelper.verifyEventLogged('Update address in your contact details');
  });

  it('clicking request card button triggers GA event', async () => {
    render(<CardRequestForm unmaskedAddress={mockUnmaskedAddress} />);

    await testHelper.clickButton('Request card', screen);
    testHelper.verifyEventLogged('Request card');
  });
});
