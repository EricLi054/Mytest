import { racwaComponentMapper } from '@/components/DataDrivenForm/racwaComponentMapper';
import { FormRenderer, validatorMapper, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { MFAFormTemplate } from '@/components/ClientComponents/MFA/Form/MFAFormTemplate';
import { type MFAVerificationState } from '@/components/ClientComponents/MFA/Types/MFAEnums';
import racwaComponentTypes from '@/components/DataDrivenForm/dynamic-components/racwaComponentTypes';
import { type MFAModalContentModel } from '../Content/mfaModalContent';
import { useMFAModalContext } from '../Context/MFAModalContext';

export const getMFAFormSchema = (content: MFAModalContentModel) => {
  return {
    fields: [
      {
        component: racwaComponentTypes.OTP_INPUT,
        name: 'OTP',
        type: 'text',
        disableInputOnErrorMessage: content.otpFieldExpiredCodeMessage,
        validate: [
          {
            type: validatorTypes.REQUIRED,
            message: content.otpFieldInvalidCodeMessage
          },
          {
            type: validatorTypes.EXACT_LENGTH,
            threshold: 6,
            message: content.otpFieldInvalidCodeMessage
          }
        ]
      }
    ]
  };
};

export interface MFAFormProps {
  mfaVerificationState: MFAVerificationState;
  onSubmit: (values: any) => Promise<void>;
  handleMFAChangeChannel: () => void;
  handleMFAResendCodeClick: () => void;
}
export const MFAForm: React.FC<MFAFormProps> = ({
  mfaVerificationState,
  handleMFAChangeChannel,
  handleMFAResendCodeClick,
  onSubmit
}) => {
  const { contentDefinition: content } = useMFAModalContext();
  if (!content) throw new Error('Content definition not found');

  return (
    <FormRenderer
      componentMapper={racwaComponentMapper}
      validatorMapper={validatorMapper}
      FormTemplate={(props) => (
        <MFAFormTemplate
          verificationState={mfaVerificationState}
          handleMFAChangeChannel={handleMFAChangeChannel}
          handleMFAResendCodeClick={handleMFAResendCodeClick}
          {...props}
        />
      )}
      schema={getMFAFormSchema(content)}
      onSubmit={onSubmit}
    />
  );
};

export const MFAFormSubmitError = (message: string) => ({
  OTP: message
});
