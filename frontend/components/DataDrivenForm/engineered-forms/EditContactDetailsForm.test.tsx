import React from 'react';
import { render, screen } from '@testing-library/react';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import FormTemplate from '@data-driven-forms/mui-component-mapper/form-template';
import { serverRacwaComponentMapper } from '../serverRacwaComponentMapper';
import { racwaValidationMapper } from '../racwaValidationMapper';
import componentTypes from '../dynamic-components/componentTypes';
import { EditableFormWizard } from '../dynamic-components/Wizard/EditableFormWizard';
import getContactDetailsMetadata from '@/graphql/getContactDetailsMetadata';

const mockPerson = {
  homePhone: '123456789',
  mobilePhone: '987654321',
  workPhone: '456789123',
  personalEmailAddress: 'test@example.com',
  postalAddress: { formattedAddress: '123 Main St' }
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

jest.mock('../handlers/checkOTPHandler', () => jest.fn());
jest.mock('../handlers/sendOTPHandler', () => jest.fn());
jest.mock('../handlers/verifyOTPHandler', () => jest.fn());
jest.mock('../../../graphql/getContactDetailsMetadata', () => jest.fn());
jest.mock('../../../graphql/getNameMetadata', () => jest.fn());
jest.mock('../../../utilities/getCrmId', () => ({
  getCrmId: jest.fn()
}));

const RendererWrapper = () => (
  <FormRenderer
    onSubmit={() => {}}
    FormTemplate={FormTemplate}
    componentMapper={serverRacwaComponentMapper}
    validatorMapper={racwaValidationMapper}
    schema={{
      fields: [
        {
          component: componentTypes.WIZARD,
          name: 'wizard',
          wizard: EditableFormWizard,
          title: 'Contact Details Edit',
          fields: [
            {
              name: 'Edit',
              fields: [
                {
                  name: 'EditContactDetailsFormStep2',
                  component: 'engineered-form'
                }
              ]
            }
          ]
        }
      ]
    }}
  />
);

describe('EditContactDetailsFormStep2', () => {
  it('renders the form with the correct initial values', async () => {
    // Mock the fetch function to return the expected data
    jest.mocked(getContactDetailsMetadata).mockReturnValue(Promise.resolve({ person: mockPerson, b2cUrl: '' }));

    render(<RendererWrapper />);

    // Wait for the form to render
    await screen.findByPlaceholderText('e.g. 0400 123 456');

    // Assert that the form fields have the correct initial values
    expect(screen.getByPlaceholderText('e.g. 0400 123 456')).toHaveValue('987654321');
    expect(screen.getByPlaceholderText('e.g. 08 1234 5678')).toHaveValue('123456789');
    expect(screen.getByPlaceholderText('e.g. 0400 123 456 or 08 1234 5678')).toHaveValue('456789123');
    expect(screen.getByPlaceholderText('e.g. example@email.com')).toHaveValue('test@example.com');
    expect(screen.getByPlaceholderText('e.g. 832 Wellington Street, PERTH WA')).toHaveValue('123 Main St');
  });
});
