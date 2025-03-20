"use client";

import type { UseFieldApiConfig } from "@data-driven-forms/react-form-renderer";
import { useRouter } from "next/navigation";
import { useFieldApi, useFormApi } from "@data-driven-forms/react-form-renderer";
import { Button, Grid2 as Grid } from "@mui/material";
import { useModalContext } from "#providers/modal/context";
import { logEvent } from "#utils/analyticsTagging";
import { z } from "zod";

import { useWizardContext } from "../hooks";

const WizardContextSchema = z.object({
  handlePrev: z.function(),
});

const FormFieldSchema = z.object({
  title: z.string(),
});

const FieldSchema = z.object({
  label: z.string(),
  modalTitle: z.string(),
  confirmText: z.string(),
  cancelText: z.string(),
});

export const WizardCancelButton = (props: UseFieldApiConfig) => {
  const wizardProps = useWizardContext();
  const { handlePrev } = WizardContextSchema.parse(wizardProps);

  const fieldProps = useFieldApi(props);
  const { label, modalTitle, confirmText, cancelText } = FieldSchema.parse(fieldProps);

  const { reset, schema } = useFormApi();
  const router = useRouter();

  const { openModal, closeModal } = useModalContext();

  const confirmModalClick = (title: string) => {
    reset();
    handlePrev();
    closeModal();
    router.refresh();
    logEvent(`${title} section - ${confirmText}`);
  };

  const cancelModalClick = (title: string) => {
    closeModal();
    logEvent(`${title} section - ${cancelText}`);
  };

  const onClick = () => {
    const { title } = FormFieldSchema.parse(schema.fields[0]);

    openModal(
      modalTitle,
      <Grid container direction="column" gap={2}>
        <Button
          color="primary"
          onClick={() => {
            confirmModalClick(title);
          }}
        >
          {confirmText}
        </Button>
        <Button
          onClick={() => {
            cancelModalClick(title);
          }}
        >
          {cancelText}
        </Button>
      </Grid>,
      closeModal,
    );

    logEvent(`${title} section - ${modalTitle} - Popup`);
  };

  return (
    <Button type="button" onClick={onClick} sx={{ marginY: 1 }}>
      {label}
    </Button>
  );
};
