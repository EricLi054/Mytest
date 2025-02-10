import { RacwaButtonSelect } from './dynamic-components/ButtonSelect/ButtonSelect';
import { RacwaInfoAlert } from './dynamic-components/InfoAlert/InfoAlert';

import { FormTextInput } from './dynamic-components/TextInput/TextInput';
import { FormSelectInput } from './dynamic-components/SelectInput/SelectInput';
import { RacwaWizard } from './dynamic-components/Wizard/RacwaWizard';
import { WizardBackButton } from './dynamic-components/WizardBackButton/WizardBackButton';
import { WizardSubmitButton } from './dynamic-components/WizardSubmitButton/WizardSubmitButton';
import { RacwaDivider } from './dynamic-components/Divider/Divider';
import { RacwaRedirectEdit } from './dynamic-components/RedirectEdit/RedirectEdit';
import { DatePicker } from './dynamic-components/DatePicker/DatePicker';
import { WizardCancelButton } from './dynamic-components/WizardCancelButton/WizardCancelButton';

import componentTypes from './dynamic-components/componentTypes';
import racwaComponentTypes from './dynamic-components/racwaComponentTypes';
import { RacwaAddressInput } from './dynamic-components/AddressInput/AddressInput';
import { RacwaPlainText } from './dynamic-components/PlainText/PlainText';
import { RacwaErrorAlert } from './dynamic-components/ErrorAlert/ErrorAlert';
import { RacwaRichText } from './dynamic-components/RichText/RichText';
import { RacwaFixedLabelPlainText } from './dynamic-components/FixedLabelPlainText/FixedLabelPlainText';
import { RacwaOTPInput } from './dynamic-components/OTPInput/OTPInput';

export const racwaComponentMapper = {
  [racwaComponentTypes.ADDRESS_INPUT]: RacwaAddressInput,
  [racwaComponentTypes.BUTTON_SELECT]: RacwaButtonSelect,
  [racwaComponentTypes.DIVIDER]: RacwaDivider,
  [racwaComponentTypes.ERROR_ALERT]: RacwaErrorAlert,
  [racwaComponentTypes.INFO_ALERT]: RacwaInfoAlert,
  [racwaComponentTypes.FIXED_LABEL_PLAIN_TEXT]: RacwaFixedLabelPlainText,
  [racwaComponentTypes.RICH_TEXT]: RacwaRichText,
  [racwaComponentTypes.REDIRECT_EDIT]: RacwaRedirectEdit,
  [racwaComponentTypes.WIZARD_SUBMIT_BUTTON]: WizardSubmitButton,
  [racwaComponentTypes.WIZARD_BACK_BUTTON]: WizardBackButton,
  [racwaComponentTypes.WIZARD_CANCEL_BUTTON]: WizardCancelButton,
  [racwaComponentTypes.OTP_INPUT]: RacwaOTPInput,
  [componentTypes.WIZARD]: RacwaWizard,
  [componentTypes.TEXT_FIELD]: FormTextInput,
  [componentTypes.SELECT]: FormSelectInput,
  [componentTypes.DATE_PICKER]: DatePicker,
  [componentTypes.PLAIN_TEXT]: RacwaPlainText
};
