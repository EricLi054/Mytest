"use client";

import type { WizardProps } from "@data-driven-forms/common/wizard";
import type { UseFieldApiConfig } from "@data-driven-forms/react-form-renderer";
import Wizard from "@data-driven-forms/common/wizard";
import selectNext from "@data-driven-forms/common/wizard/select-next";
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import { Grid2 as Grid, Typography } from "@mui/material";
import { useMFAContext } from "#providers/mfa/context";
import { logFieldTouched } from "#utils/analyticsTagging";

import { StyledEditButton } from "../styled";
import { useEditableFormWizard } from "./hooks";
import { StyledGrid } from "./styled";

const ContactDetailsWizard = (props: UseFieldApiConfig | object) => {
  const { title } = useFieldApi(props as UseFieldApiConfig);
  const { formOptions, currentStep, handleNext, activeStepIndex } = useEditableFormWizard();
  const { openMFAModal } = useMFAContext();

  const handleMFATokenSuccess = () => {
    if (currentStep.nextStep) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      handleNext(selectNext(currentStep.nextStep, formOptions.getState));
    }
  };

  const handleEditButtonClick = () => {
    logFieldTouched(`Edit - ${title as string}`);
    openMFAModal(handleMFATokenSuccess);
  };

  return (
    <StyledGrid container direction="column" width="100%">
      <Grid container sx={{ minHeight: "3rem" }}>
        <Grid size={{ xs: 9 }}>
          <Typography variant="h3">{title}</Typography>
        </Grid>
        {currentStep.nextStep && (
          <Grid
            container
            size={{ xs: 3 }}
            justifyContent="flex-end"
            visibility={activeStepIndex === 1 ? "hidden" : "visible"}
          >
            <StyledEditButton type="button" onClick={handleEditButtonClick}>
              Edit
            </StyledEditButton>
          </Grid>
        )}
      </Grid>
      <Grid size="grow">
        <Grid container direction="column" gap={1}>
          {formOptions.renderForm(currentStep.fields)}
        </Grid>
      </Grid>
    </StyledGrid>
  );
};

export default function RacwaWizard(props: WizardProps) {
  return <Wizard {...props} Wizard={ContactDetailsWizard} />;
}
