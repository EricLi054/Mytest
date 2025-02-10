import { render, screen } from '@testing-library/react';
import NameChangeConfirmationContent from './NameChangeConfirmationContent';
import { testHelper } from '@/__tests__/helpers/testHelpers';

jest.mock('../../../utilities/getCrmId', () => ({
  getCrmId: jest.fn()
}));

const onConfirm = jest.fn();
const onCancel = jest.fn();
const logNameChangeEvent = jest.fn();

describe('Name Change Confirmation', () => {
  it('displays an error if no option selected', async () => {
    render(
      <NameChangeConfirmationContent
        onConfirm={onConfirm}
        onCancel={onCancel}
        logNameChangeEvent={logNameChangeEvent}
      />
    );

    await testHelper.clickButton('Update name', screen);

    expect(screen.getByText('Please select an option')).toBeVisible();
    expect(onConfirm).not.toHaveBeenCalled();
  });
  it('something else option gives error alert and disables submission', async () => {
    render(
      <NameChangeConfirmationContent
        onConfirm={onConfirm}
        onCancel={onCancel}
        logNameChangeEvent={logNameChangeEvent}
      />
    );

    const somethingElseButton = screen.getByRole('radio', { name: 'Something else' });

    await testHelper.clickElement(somethingElseButton);

    expect(screen.getByText("Sorry, you can't do this online")).toBeVisible();
    expect(screen.getByRole('button', { name: 'Update name' })).toBeDisabled();
  });
  it('going from something else option to valid option gives regular alert and allows button to be clicked', async () => {
    render(
      <NameChangeConfirmationContent
        onConfirm={onConfirm}
        onCancel={onCancel}
        logNameChangeEvent={logNameChangeEvent}
      />
    );

    const somethingElseButton = screen.getByRole('radio', { name: 'Something else' });
    await testHelper.clickElement(somethingElseButton);
    expect(screen.getByText("Sorry, you can't do this online")).toBeVisible();

    const correctTheSpelling = screen.getByRole('radio', { name: 'Correct the spelling' });
    await testHelper.clickElement(correctTheSpelling);
    expect(screen.getByText('Please note')).toBeVisible();

    await testHelper.clickButton('Update name', screen);
    expect(onConfirm).toHaveBeenCalled();
  });
  it('cancel button calls the provided function', async () => {
    render(
      <NameChangeConfirmationContent
        onConfirm={onConfirm}
        onCancel={onCancel}
        logNameChangeEvent={logNameChangeEvent}
      />
    );

    await testHelper.clickButton('Cancel', screen);
    expect(onCancel).toHaveBeenCalled();
  });
});
