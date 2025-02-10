import { logFieldTouched, logFieldCleared, logFieldValidationError } from '@/utilities/analyticsTagging';
import { useFieldApi } from '@data-driven-forms/react-form-renderer';

export const useGTMFormEvents = (controlProps: any) => {
  const { input, meta, label, disableGTM } = useFieldApi(controlProps);

  const logFormFieldValidation = () => {
    if (disableGTM) return;
    const currentError: string = meta?.error;
    const initialValue = meta.initial;
    const newValue = input.value;

    currentError && logFieldValidationError(label);
    const hasFieldValueCleared = initialValue?.trim()?.length > 0 && newValue?.trim()?.length === 0;
    hasFieldValueCleared && logFieldCleared(label);
  };

  const logFormFieldTouched = () => {
    if (disableGTM) return;
    logFieldTouched(label);
  };

  return { logFormFieldValidation, logFormFieldTouched };
};
