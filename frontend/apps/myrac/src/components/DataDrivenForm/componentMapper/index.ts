import { componentTypes } from "../components";
import { RacwaAddressInput } from "../components/AddressInput";
import { RacwaButtonSelect } from "../components/ButtonSelect";
import { RacwaDivider } from "../components/Divider";
import { RacwaFixedLabelPlainText } from "../components/FixedLabelPlainText";
import { RacwaInfoAlert } from "../components/InfoAlert";
import { RacwaPlainText } from "../components/PlainText";
import { RacwaRedirectEdit } from "../components/RedirectEdit";
import { RacwaRichText } from "../components/RichText";
import { TextField } from "../components/TextField";
import RacwaWizard from "../components/Wizard";
import { WizardCancelButton } from "../components/Wizard/WizardCancelButton";
import { WizardSubmitButton } from "../components/Wizard/WizardSubmitButton";

export const racwaComponentMapper = {
  [componentTypes.ADDRESS_INPUT]: RacwaAddressInput,
  [componentTypes.BUTTON_SELECT]: RacwaButtonSelect,
  [componentTypes.DIVIDER]: RacwaDivider,
  [componentTypes.INFO_ALERT]: RacwaInfoAlert,
  [componentTypes.FIXED_LABEL_PLAIN_TEXT]: RacwaFixedLabelPlainText,
  [componentTypes.RICH_TEXT]: RacwaRichText,
  [componentTypes.REDIRECT_EDIT]: RacwaRedirectEdit,
  [componentTypes.WIZARD_SUBMIT_BUTTON]: WizardSubmitButton,
  [componentTypes.WIZARD_CANCEL_BUTTON]: WizardCancelButton,
  [componentTypes.WIZARD]: RacwaWizard,
  [componentTypes.TEXT_FIELD]: TextField,
  [componentTypes.PLAIN_TEXT]: RacwaPlainText,
};
