import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import FormTemplate from '@data-driven-forms/mui-component-mapper/form-template';
import { serverRacwaComponentMapper } from '../serverRacwaComponentMapper';
import { racwaValidationMapper } from '../racwaValidationMapper';
import componentTypes from '../dynamic-components/componentTypes';
import { EditableFormWizard } from '../dynamic-components/Wizard/EditableFormWizard';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import getNameMetadata from '@/graphql/getNameMetadata';
import userEvent from '@testing-library/user-event';
import { ModalProvider } from '@/components/ClientComponents/Modal/ModalProvider';
import { MFAModalProvider } from '@/components/ClientComponents/MFA/MFAModalProvider';
import { testHelper } from '@/__tests__/helpers/testHelpers';

const mockPerson: PersonInformation = {
  title: 'Mr',
  firstName: 'John',
  middleName: 'James',
  surname: 'Smith'
};

const routerPushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => {
    return {
      push: routerPushMock,
      refresh: jest.fn()
    };
  }
}));

const mockCheckOtpIsVerifiedResponse = {
  checkOtpQueryResponse: {
    isVerified: true,
    mobilePhone: '0412345678',
    landline: '94001234'
  }
};

jest.mock('../handlers/checkOTPHandler', () =>
  jest.fn(() => {
    return mockCheckOtpIsVerifiedResponse;
  })
);
jest.mock('../handlers/sendOTPHandler', () => jest.fn());
jest.mock('../handlers/verifyOTPHandler', () => jest.fn());
jest.mock('../../../graphql/getContactDetailsMetadata', () => jest.fn());
jest.mock('../../../graphql/getNameMetadata', () => jest.fn());
jest.mock('../../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn(),
  logFieldTouched: jest.fn()
}));
jest.mock('../../../utilities/getCrmId', () => ({
  getCrmId: jest.fn()
}));

const RendererWrapper = () => (
  <MFAModalProvider>
    <ModalProvider>
      <FormRenderer
        onSubmit={async () => {
          return { ok: true };
        }}
        FormTemplate={FormTemplate}
        componentMapper={serverRacwaComponentMapper}
        validatorMapper={racwaValidationMapper}
        schema={{
          fields: [
            {
              component: componentTypes.WIZARD,
              name: 'wizard',
              wizard: EditableFormWizard,
              title: 'Name Edit',
              fields: [
                {
                  name: 'Edit',
                  fields: [
                    {
                      name: 'EditNameFormStep2',
                      component: 'engineered-form'
                    }
                  ]
                }
              ]
            }
          ]
        }}
      />
    </ModalProvider>
  </MFAModalProvider>
);

describe('EditNameFormStep2', () => {
  it('renders the form with the correct initial values', async () => {
    // Mock the fetch function to return the expected data
    jest.mocked(getNameMetadata).mockReturnValue(Promise.resolve({ person: mockPerson }));

    render(<RendererWrapper />);

    // Assert that the form fields have the correct initial values
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Mr' })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Mr' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByPlaceholderText('e.g. John')).toHaveValue('John');
    expect(screen.getByPlaceholderText('e.g. James')).toHaveValue('James');
    expect(screen.getByPlaceholderText('e.g. Smith')).toHaveValue('Smith');
  });
  it('change first name with a verification modal appearing on submission', async () => {
    // Mock the fetch function to return the expected data
    jest.mocked(getNameMetadata).mockReturnValue(Promise.resolve({ person: mockPerson }));

    render(<RendererWrapper />);

    // Wait for form to load and change first name
    await waitFor(() => {
      expect(screen.getByPlaceholderText('e.g. John')).toBeInTheDocument();
    });
    const firstNameField = screen.getByPlaceholderText('e.g. John');
    await act(async () => {
      await userEvent.type(firstNameField, 'Tester');
    });

    // submit form and check verification shows
    await testHelper.clickButton('Update name', screen);
    await waitFor(() => {
      expect(screen.getByText('Your first name is important')).toBeInTheDocument();
    });
    testHelper.verifyEventLogged('Name section - Your first name is important - Popup');

    // accept verification and check confirmation shows
    const correctTheSpelling = screen.getByRole('radio', { name: 'Correct the spelling' });
    await testHelper.clickElement(correctTheSpelling);
    await testHelper.clickButton('Update name', screen);
    await waitFor(() => {
      expect(screen.getByText("You've updated your name")).toBeInTheDocument();
    });
    testHelper.verifyEventLogged('Name section - Your first name is important - Update name');
  });
  it('change first name with a verification modal appearing on submission and cancelling closes modal without saving', async () => {
    // Mock the fetch function to return the expected data
    jest.mocked(getNameMetadata).mockReturnValue(Promise.resolve({ person: mockPerson }));

    render(<RendererWrapper />);

    // Wait for form to load and change first name
    await waitFor(() => {
      expect(screen.getByPlaceholderText('e.g. John')).toBeInTheDocument();
    });
    const firstNameField = screen.getByPlaceholderText('e.g. John');
    await act(async () => {
      await userEvent.type(firstNameField, 'Tester');
    });

    // submit form and check verification shows
    await testHelper.clickButton('Update name', screen);
    await waitFor(() => {
      expect(screen.getByText('Your first name is important')).toBeInTheDocument();
    });
    testHelper.verifyEventLogged('Name section - Your first name is important - Popup');

    // cancel verification and check still in edit more
    await testHelper.clickButton('Cancel', screen);
    testHelper.verifyEventLogged('Name section - Your first name is important - Cancel');
    expect(screen.getByText('Update name')).toBeInTheDocument();
  });
  it('change last name with no verification modal appearing on submission', async () => {
    // Mock the fetch function to return the expected data
    jest.mocked(getNameMetadata).mockReturnValue(Promise.resolve({ person: mockPerson }));

    render(<RendererWrapper />);

    // Wait for form to load and change first name
    await waitFor(() => {
      expect(screen.getByPlaceholderText('e.g. Smith')).toBeInTheDocument();
    });
    const firstNameField = screen.getByPlaceholderText('e.g. Smith');
    await act(async () => {
      await userEvent.type(firstNameField, 'Brown');
    });

    // submit form and check confirmation shows
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Update name' }));
    });
    await waitFor(() => {
      expect(screen.getByText("You've updated your name")).toBeInTheDocument();
    });
  });
});
