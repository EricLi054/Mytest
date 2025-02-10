'use client';
import { useContext } from 'react';
import WizardContext from '@data-driven-forms/react-form-renderer/wizard-context';
import { Button, Grid, styled } from '@mui/material';
import { useFieldApi, useFormApi } from '@data-driven-forms/react-form-renderer';
import { logEvent } from '@/utilities/analyticsTagging';
import { useRouter } from 'next/navigation';
import { useModalContext } from '@/components/ClientComponents/Modal/ModalContext';

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));

export const WizardCancelButton = (props: any) => {
  const { handlePrev } = useContext(WizardContext);
  const { label, modalTitle, confirmText, cancelText } = useFieldApi(props);
  const formOptions = useFormApi();
  const router = useRouter();
  const { openModal, closeModal } = useModalContext();

  const onClick = () => {
    openModal(
      modalTitle,
      <Grid container direction='column' gap={2}>
        <Button
          color='primary'
          onClick={() => {
            formOptions.reset();
            handlePrev();
            closeModal();
            router.refresh();
            logEvent(`${formTitle} section - ${confirmText as string}`);
          }}
        >
          {confirmText}
        </Button>
        <Button
          onClick={() => {
            closeModal();
            logEvent(`${formTitle} section - ${cancelText as string}`);
          }}
        >
          {cancelText}
        </Button>
      </Grid>,
      closeModal
    );
    logEvent(`${formTitle} section - ${modalTitle as string} - Popup`);
  };

  const formTitle: string = formOptions.schema?.fields?.length ? formOptions.schema?.fields[0]?.title : '';
  return (
    <StyledButton type='button' onClick={onClick}>
      {label}
    </StyledButton>
  );
};
