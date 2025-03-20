"use client";

import type { UseFieldApiConfig } from "@data-driven-forms/react-form-renderer";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldApi, useFormApi } from "@data-driven-forms/react-form-renderer";
import { Button, Grid2 as Grid } from "@mui/material";
import InternalRichTextRenderer from "#components/RichText/InternalRichTextRenderer";
import { useMFAContext } from "#providers/mfa/context";
import { useModalContext } from "#providers/modal/context";
import { logEvent } from "#utils/analyticsTagging";

import { useWizardContext } from "../hooks";
import { FieldSchema, FormApiSchema, WizardContextSchema } from "./schema";

export const WizardSubmitButton = (props: UseFieldApiConfig) => {
  const wizardProps = useWizardContext();
  const { handlePrev } = WizardContextSchema.parse(wizardProps);

  const fieldProps = useFieldApi(props);
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
    confirmationLogger,
  } = FieldSchema.parse(fieldProps);

  const formApi = useFormApi();
  const { getState, reset, handleSubmit } = FormApiSchema.parse(formApi);

  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const { openMFAModal } = useMFAContext();
  const { openModal, closeModal } = useModalContext();

  const closeSubmitModal = (success: boolean) => {
    if (success) {
      logEvent(`${label} closed - Popup`);
      reset();
      handlePrev();
      router.refresh();
    }
    closeModal();
  };

  const handleSubmitWithMFA = () => {
    logEvent(`Button click - ${label}`);
    if (
      requiresConfirmation &&
      requiresConfirmation(getState().dirtyFields) &&
      confirmationTitle &&
      ConfirmationContent &&
      confirmationLogger
    ) {
      openModal(
        confirmationTitle,
        <ConfirmationContent
          onConfirm={() => {
            closeModal();
            openMFAModal(onSubmit);
          }}
          onCancel={closeModal}
          logNameChangeEvent={confirmationLogger}
        />,
        closeModal,
      );
    } else {
      openMFAModal(onSubmit);
    }
  };

  const onSubmit = async () => {
    setSubmitting(true);

    const successfulRequest = await handleSubmit();

    logEvent(
      `${label} submission ${successfulRequest ? "succeeded" : "failed"} - ${successfulRequest ? successTitle : errorTitle} - Popup`,
    );

    openModal(
      successfulRequest ? successTitle : errorTitle,
      <Grid container direction="column" gap={2}>
        {successfulRequest && successText && <InternalRichTextRenderer text={successText} />}
        {!successfulRequest && errorText && <InternalRichTextRenderer text={errorText} />}
        <Button
          color="primary"
          onClick={() => {
            closeSubmitModal(successfulRequest);
          }}
        >
          {successfulRequest ? successButtonText : errorButtonText}
        </Button>
      </Grid>,
    );

    setSubmitting(false);
  };

  return (
    <Button
      type="button"
      color="primary"
      disabled={getState().hasValidationErrors || getState().pristine || submitting}
      onClick={handleSubmitWithMFA}
      sx={{ marginY: 1 }}
    >
      {label}
    </Button>
  );
};
