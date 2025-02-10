'use client';

import { useFieldApi, useFormApi } from '@data-driven-forms/react-form-renderer';
import WizardContext from '@data-driven-forms/react-form-renderer/wizard-context';
import { Button, Grid, styled } from '@mui/material';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import BaseRichTextRenderer from '../BaseRichTextRenderer';
import { logEvent } from '@/utilities/analyticsTagging';
import { useLoadingContext } from '@/components/ClientComponents/Loading/LoadingContext';
import { useMFAModalContext } from '@/components/ClientComponents/MFA/Context/MFAModalContext';
import { useModalContext } from '@/components/ClientComponents/Modal/ModalContext';

export type RequiresConfirmationFunction = (dirtyValues: Record<string, boolean>) => boolean;

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));

export const WizardSubmitButton = (props: any) => {
  const { handlePrev } = useContext(WizardContext);
  const { openLoadingIndicator, closeLoadingIndicator } = useLoadingContext();
  const {
    label,
    successTitle,
    successText,
    successButtonText,
    errorTitle,
    errorText,
    errorButtonText,
    requiresConfirmation,
    confirmationTitle,
    ConfirmationContent,
    confirmationLogger
  } = useFieldApi(props);
  const { getState, reset, handleSubmit } = useFormApi();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { openMFAModal } = useMFAModalContext();
  const { openModal, closeModal } = useModalContext();

  const closeSubmitModal = (success: boolean) => {
    if (success) {
      logEvent(`${label as string} closed - Popup`);
      reset();
      handlePrev();
      router.refresh();
    }
    closeModal();
  };

  const handleSubmitWithMFA = async () => {
    logEvent(`Button click - ${label as string}`);
    if (requiresConfirmation && (requiresConfirmation as RequiresConfirmationFunction)(getState().dirtyFields)) {
      openModal(
        confirmationTitle,
        <ConfirmationContent
          onConfirm={async () => {
            closeModal();
            await openMFAModal(onSubmit);
          }}
          onCancel={closeModal}
          logNameChangeEvent={confirmationLogger}
        />,
        closeModal
      );
    } else {
      await openMFAModal(onSubmit);
    }
  };

  const onSubmit = async () => {
    openLoadingIndicator();
    setSubmitting(true);

    const res = await handleSubmit();
    const successfulRequest = res?.ok === true;

    logEvent(
      `${label as string} submission ${successfulRequest ? 'succeeded' : 'failed'} - ${(successfulRequest ? successTitle : errorTitle) as string} - Popup`
    );

    openModal(
      successfulRequest ? successTitle : errorTitle,
      <Grid container direction='column' gap={2}>
        {successfulRequest && successText && <BaseRichTextRenderer richText={successText} />}
        {!successfulRequest && errorText && <BaseRichTextRenderer richText={errorText} />}
        <Button
          color='primary'
          onClick={() => {
            closeSubmitModal(successfulRequest);
          }}
        >
          {successfulRequest ? successButtonText : errorButtonText}
        </Button>
      </Grid>
    );

    setSubmitting(false);
    closeLoadingIndicator();
  };

  return (
    <StyledButton
      type='button'
      color='primary'
      disabled={getState().hasValidationErrors || getState().pristine || submitting}
      onClick={handleSubmitWithMFA}
    >
      {label}
    </StyledButton>
  );
};
