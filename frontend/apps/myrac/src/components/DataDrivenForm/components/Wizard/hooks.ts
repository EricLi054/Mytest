"use client";

import type { Field } from "@data-driven-forms/react-form-renderer";
import type { WizardContextValue } from "@data-driven-forms/react-form-renderer/wizard-context";
import type { Context } from "react";
import { useContext } from "react";
import WizardContext from "@data-driven-forms/react-form-renderer/wizard-context";

type EditableFormWizardContextValue = {
  currentStep: {
    name: string;
    title: string;
    fields: Field[];
    nextStep?: string;
  };
} & WizardContextValue;

export const useEditableFormWizard = () =>
  useContext<EditableFormWizardContextValue>(WizardContext as unknown as Context<EditableFormWizardContextValue>);

export const useWizardContext = () => useContext(WizardContext);
