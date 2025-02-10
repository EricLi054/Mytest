import { render, screen, act } from '@testing-library/react';
import { DataDrivenForm } from '@/components/DataDrivenForm/DataDrivenForm';
import { testSchemaFullDetailForm } from './testSchemaFullDetailForm';
import userEvent from '@testing-library/user-event';
import { testSchemaLoginDetails } from './testSchemaLoginDetails';
import { testSchemaAddressLookup } from './testSchemaAddressLookup';
import { testSchemaValidators } from './testSchemaValidators';
import personUpdateHandler from './handlers/personUpdateHandler';
import checkOTPHandler from './handlers/checkOTPHandler';

import { testSchemaRichText } from './testSchemaRichText';
import { type CheckOtpResponse } from '@/graphql/checkOTP';
import { MFAModalProvider } from '../ClientComponents/MFA/MFAModalProvider';
import { ModalProvider } from '../ClientComponents/Modal/ModalProvider';

const mockAddresses = {
  addressList: {
    data: [
      {
        id: 1,
        attributes: {
          partialAddress: '832 Wellington Street, West Perth WA 6005'
        }
      }
    ]
  }
};
jest.mock('../../graphql/getData', () => jest.fn(() => mockAddresses));

jest.mock('./handlers/personUpdateHandler', () => jest.fn());

jest.mock('./handlers/checkOTPHandler', () => jest.fn());

jest.mock('./handlers/sendOTPHandler', () => jest.fn());

jest.mock('./handlers/verifyOTPHandler', () => jest.fn());

jest.mock('../../graphql/getContactDetailsMetadata', () => jest.fn());

jest.mock('../../graphql/getNameMetadata', () => jest.fn());

jest.mock('../../graphql/getPerson', () => jest.fn());

jest.mock('../../utilities/getCrmId', () => ({
  getCrmId: jest.fn()
}));

const checkOtpMobilePhone = '0412345678';
const checkOtpLandline = '94001234';

const mockCheckOtpIsVerifiedResponse: CheckOtpResponse = {
  checkOtpQueryResponse: {
    isVerified: true,
    mobilePhone: checkOtpMobilePhone,
    landline: checkOtpLandline
  }
};

jest.mocked(checkOTPHandler).mockReturnValue(Promise.resolve(mockCheckOtpIsVerifiedResponse));

const routerPushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => {
    return {
      push: routerPushMock,
      refresh: jest.fn()
    };
  }
}));

describe('DataDrivenForm', () => {
  it('render an address input form', async () => {
    render(<DataDrivenForm schema={testSchemaAddressLookup} />);
    const editButton = screen.getByText<HTMLButtonElement>('Edit');
    await act(async () => {
      await userEvent.click(editButton);
    });

    // Test tooltip
    const tooltipButton = screen.getByRole<HTMLButtonElement>('button', {
      name: 'show tooltip'
    });
    expect(tooltipButton).toBeVisible();
    await act(async () => {
      await userEvent.click(tooltipButton);
    });
    const tooltipCloseButton = screen.getByRole<HTMLButtonElement>('button', {
      name: 'close'
    });
    expect(tooltipCloseButton).toBeVisible();
    await act(async () => {
      await userEvent.click(tooltipCloseButton);
    });

    // Test address input
    const addressInput = screen.getByPlaceholderText<HTMLInputElement>('Enter address');
    expect(addressInput).toBeVisible();
    await act(async () => {
      await userEvent.type(addressInput, '832 Wellington Street');
    });
    expect(addressInput.value).toEqual('832 Wellington Street');
  }, 15000);

  it('testing error states for form validators', async () => {
    render(<DataDrivenForm schema={testSchemaValidators} />);
    const editButton = screen.getByText<HTMLButtonElement>('Edit');
    await act(async () => {
      await userEvent.click(editButton);
    });

    // Test no removal validator
    const noRemoval = screen.getByPlaceholderText<HTMLInputElement>('no-removal-validator');
    await act(async () => {
      await userEvent.clear(noRemoval);
    });
    expect(screen.getByText("This field can't be removed")).toBeVisible();

    // Test name validator
    const nameValidator = screen.getByPlaceholderText<HTMLInputElement>('name-validator');
    await act(async () => {
      await userEvent.type(nameValidator, 'John/%');
    });
    expect(screen.getByText('Invalid Name')).toBeVisible();

    // Test email validator
    const emailValidator = screen.getByPlaceholderText<HTMLInputElement>('email-validator');
    await act(async () => {
      await userEvent.type(emailValidator, 'test@test');
    });
    expect(screen.getByText('Invalid email')).toBeVisible();

    // Test mobile validator
    const mobileValidator = screen.getByPlaceholderText<HTMLInputElement>('mobile-validator');
    await act(async () => {
      await userEvent.type(mobileValidator, '05000000000');
    });
    expect(screen.getByText('Invalid mobile number')).toBeVisible();

    // Test landline phone validator
    const landlineValidator = screen.getByPlaceholderText<HTMLInputElement>('landline-validator');
    await act(async () => {
      await userEvent.type(landlineValidator, '05000000000');
    });
    expect(screen.getByText('Invalid landline')).toBeVisible();

    // Test landline and mobile phone validator
    const landlineAndMobileValidator = screen.getByPlaceholderText<HTMLInputElement>('landline-and-mobile-validator');
    await act(async () => {
      await userEvent.type(landlineAndMobileValidator, '05000000000');
    });
    expect(screen.getByText('Invalid phone number')).toBeVisible();
  }, 15000);

  it('should render a login details change form after clicking edit and can click back', async () => {
    render(<DataDrivenForm schema={testSchemaLoginDetails} />);
    const editButton = screen.getByText<HTMLButtonElement>('Edit');
    await act(async () => {
      await userEvent.click(editButton);
    });

    const emailSection = screen.getByText('{{ person.loginEmail }}');
    expect(emailSection).toBeVisible();

    const backButton = screen.getByText<HTMLButtonElement>('Back');
    await act(async () => {
      await userEvent.click(backButton);
    });
  });

  it('check initial value is set', async () => {
    const expectedResult = 'John';
    render(<DataDrivenForm schema={testSchemaValidators} />);
    const editButton = screen.getByText<HTMLButtonElement>('Edit');
    await act(async () => {
      await userEvent.click(editButton);
    });

    const inputElement = screen.getByPlaceholderText<HTMLInputElement>('no-removal-validator');
    expect(inputElement.value).toBe(expectedResult);
  });

  it('render the form and open / close the tooltip', async () => {
    render(<DataDrivenForm schema={testSchemaFullDetailForm} />);
    const editButton = screen.getByText<HTMLButtonElement>('Edit');
    await act(async () => {
      await userEvent.click(editButton);
    });

    // Test tooltip open and close
    const tooltipButton = screen.getByRole<HTMLButtonElement>('button', {
      name: 'show tooltip'
    });
    expect(tooltipButton).toBeVisible();
    await act(async () => {
      await userEvent.click(tooltipButton);
    });
    const tooltipCloseButton = screen.getByRole<HTMLButtonElement>('button', {
      name: 'close'
    });
    expect(tooltipCloseButton).toBeVisible();
    await act(async () => {
      await userEvent.click(tooltipCloseButton);
    });
  });

  it('should cancel editing a form', async () => {
    render(
      <ModalProvider>
        <DataDrivenForm schema={testSchemaFullDetailForm} />
      </ModalProvider>
    );
    const editButton = screen.getByText<HTMLButtonElement>('Edit');
    await act(async () => {
      await userEvent.click(editButton);
    });

    const inputElement = screen.getByPlaceholderText<HTMLInputElement>('e.g. John');
    expect(inputElement).toBeVisible();

    // Test cancelling cancel
    const cancelButton = screen.getByText<HTMLButtonElement>('Cancel');
    await act(async () => {
      await userEvent.click(cancelButton);
    });
    const noButton = screen.getByText<HTMLButtonElement>('No, go back');
    await act(async () => {
      await userEvent.click(noButton);
    });

    // Test cancelling
    await act(async () => {
      await userEvent.click(cancelButton);
    });
    const confirmButton = screen.getByText<HTMLButtonElement>('Yes, please cancel');
    await act(async () => {
      await userEvent.click(confirmButton);
    });
    const editButton2 = screen.getByText<HTMLButtonElement>('Edit');
    expect(editButton2).toBeVisible();
  });

  it('complete and submit form successfully', async () => {
    jest.mocked(personUpdateHandler).mockReturnValueOnce(Promise.resolve({ ok: true, data: {} }));

    render(
      <MFAModalProvider id='test'>
        <ModalProvider>
          <DataDrivenForm schema={testSchemaFullDetailForm} />
        </ModalProvider>
      </MFAModalProvider>
    );
    const editButton = screen.getByText<HTMLButtonElement>('Edit');
    await act(async () => {
      await userEvent.click(editButton);
    });

    const fixedLabel = screen.getByText('Fixed');
    expect(fixedLabel).toBeVisible();
    expect(fixedLabel).toHaveStyle('width: 100px;');

    const mrTitle = screen.getByText<HTMLButtonElement>('Mr');
    const firstName = screen.getByPlaceholderText<HTMLInputElement>('e.g. John');
    const surname = screen.getByPlaceholderText<HTMLInputElement>('e.g. Smith');
    const mobile = screen.getByPlaceholderText<HTMLInputElement>('e.g. 0400 000 000');

    expect(mrTitle).toBeVisible();
    expect(firstName).toBeVisible();
    expect(surname).toBeVisible();
    expect(mobile).toBeVisible();

    await act(async () => {
      await userEvent.click(mrTitle);
    });
    await act(async () => {
      await userEvent.type(firstName, 'John');
    });
    await act(async () => {
      await userEvent.type(surname, 'Smith');
    });
    await act(async () => {
      await userEvent.type(mobile, '0400000000');
    });

    const submitButton = screen.getByText<HTMLButtonElement>('Update name');
    expect(submitButton).toBeEnabled();
    await act(async () => {
      await userEvent.click(submitButton);
    });

    expect(checkOTPHandler).toHaveBeenCalled();
    expect(personUpdateHandler).toHaveBeenCalled();

    expect(screen.getByText("You've updated your name")).toBeVisible();
    const okayButton = screen.getByText<HTMLButtonElement>('Okay');
    await act(async () => {
      await userEvent.click(okayButton);
    });
  }, 10000);

  it('complete and submit form, failure from dob validation', async () => {
    jest.mocked(personUpdateHandler).mockReturnValueOnce(
      Promise.resolve({
        ok: false,
        data: {
          errors: [
            {
              message: 'Error updating person',
              extensions: {
                type: 'error-updating'
              }
            }
          ]
        }
      })
    );
    render(
      <MFAModalProvider id='test'>
        <ModalProvider>
          <DataDrivenForm schema={testSchemaFullDetailForm} />
        </ModalProvider>
      </MFAModalProvider>
    );
    const editButton = screen.getByText<HTMLButtonElement>('Edit');
    await act(async () => {
      await userEvent.click(editButton);
    });

    const mrTitle = screen.getByText<HTMLButtonElement>('Mr');
    const firstName = screen.getByPlaceholderText<HTMLInputElement>('e.g. John');
    const surname = screen.getByPlaceholderText<HTMLInputElement>('e.g. Smith');
    const mobile = screen.getByPlaceholderText<HTMLInputElement>('e.g. 0400 000 000');

    expect(mrTitle).toBeVisible();
    expect(firstName).toBeVisible();
    expect(surname).toBeVisible();
    expect(mobile).toBeVisible();

    await act(async () => {
      await userEvent.click(mrTitle);
    });
    await act(async () => {
      await userEvent.type(firstName, 'John');
    });
    await act(async () => {
      await userEvent.type(surname, 'Smith');
    });
    await act(async () => {
      await userEvent.type(mobile, '0400000000');
    });

    const submitButton = screen.getByText<HTMLButtonElement>('Update name');
    expect(submitButton).toBeEnabled();
    await act(async () => {
      await userEvent.click(submitButton);
    });
    expect(personUpdateHandler).toHaveBeenCalled();

    expect(screen.getByText('Error updating your name')).toBeVisible();
    const okayButton = screen.getByText<HTMLButtonElement>('Okay');
    await act(async () => {
      await userEvent.click(okayButton);
    });
  }, 10000);

  it('render rich text component', async () => {
    render(<DataDrivenForm schema={testSchemaRichText} />);

    const richTextComponent = screen.getByText('Rich text component');
    expect(richTextComponent).toBeVisible();
  });
});
