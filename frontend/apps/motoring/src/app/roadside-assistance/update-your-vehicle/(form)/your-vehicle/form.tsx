"use client";

import type { z } from "zod";
import { useActionState, useEffect } from "react";
import { FormProvider, getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Box, FormControl } from "@mui/material";
import BackButton from "#components/BackButton";
import ContentfulNotificationCard from "#components/ContentfulNotificationCard";
import { generateContentfulTooltipProps } from "#components/ContentfulTooltip";
import FormLoadingModal from "#components/FormLoadingModal";
import SubmitButton from "#components/SubmitButton";
import { logEvent, logFieldTouched, logPageView } from "#utils/analyticsTagging";
import { getHelperText } from "#utils/getHelperText";

import { ToggleButtonGroup } from "@racwa/ui";

import type { YourVehicleAction } from "./actions";
import type { YourVehicleContentfulSchema } from "./schema";
import { IsBrokenDown, isBrokenDownOptions, VehicleUse, vehicleUseOptions, YourVehicleFormSchema } from "./schema";

const handleButtonGtmEvents = (description: string, selectedOption: string) => {
  logFieldTouched(`${description}`);
  logEvent(`${description} - ${selectedOption}`);
};

export type YourVehicleFormProps = {
  defaultValues?: z.infer<typeof YourVehicleFormSchema>;
  yourVehicleAction: YourVehicleAction;
  myRacUrl: string;
  contentfulData: z.infer<typeof YourVehicleContentfulSchema>;
};

export default function YourVehicleForm({
  defaultValues,
  yourVehicleAction,
  myRacUrl,
  contentfulData,
}: YourVehicleFormProps) {
  const [lastResult, action] = useActionState(yourVehicleAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema: YourVehicleFormSchema }),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: defaultValues,
  });

  const isBrokenDown = fields.isBrokenDown.value === IsBrokenDown.Yes;
  const isBusinessUse = fields.vehicleUse.value === VehicleUse.Business;

  const disableSubmit = isBrokenDown || isBusinessUse;

  useEffect(logPageView, []);

  useEffect(() => {
    if (isBrokenDown) {
      logEvent("Sorry, you can't continue online - Broken down now");
    }
  }, [isBrokenDown]);

  useEffect(() => {
    if (isBusinessUse) {
      logEvent("Sorry, you can't continue online - Business use");
    }
  }, [isBusinessUse]);

  return (
    <FormProvider context={form.context}>
      <form {...getFormProps(form)} action={action}>
        <FormLoadingModal />
        <Box display="flex" flexDirection="column">
          <FormControl error={!fields.isBrokenDown.valid}>
            <ToggleButtonGroup
              id={fields.isBrokenDown.id}
              name={fields.isBrokenDown.name}
              label={contentfulData.fields.isBrokenDown.label}
              tooltipProps={
                contentfulData.fields.isBrokenDown.tooltipTitle && contentfulData.fields.isBrokenDown.tooltipContent
                  ? generateContentfulTooltipProps({
                      title: contentfulData.fields.isBrokenDown.tooltipTitle,
                      message: contentfulData.fields.isBrokenDown.tooltipContent,
                      onClick: () => logEvent("Tooltip - Is your vehicle broken down now"),
                    })
                  : undefined
              }
              options={isBrokenDownOptions.map((v) => v)}
              helperText={getHelperText({
                errors: fields.isBrokenDown.errors,
                invalidMessage: contentfulData.fields.isBrokenDown.invalidErrorMessage,
                requiredMessage: contentfulData.fields.isBrokenDown.requiredErrorMessage,
              })}
              onChange={(_, v) => handleButtonGtmEvents("Is your vehicle broken down now", v)}
            />
          </FormControl>
          {isBrokenDown && (
            <ContentfulNotificationCard {...contentfulData.notifications.vehicleBrokenDownNotificationCard} />
          )}

          <FormControl error={!fields.vehicleUse.valid}>
            <ToggleButtonGroup
              id={fields.vehicleUse.id}
              name={fields.vehicleUse.name}
              label={contentfulData.fields.vehicleUse.label}
              tooltipProps={
                contentfulData.fields.vehicleUse.tooltipTitle && contentfulData.fields.vehicleUse.tooltipContent
                  ? generateContentfulTooltipProps({
                      title: contentfulData.fields.vehicleUse.tooltipTitle,
                      message: contentfulData.fields.vehicleUse.tooltipContent,
                      onClick: () => logEvent("Tooltip - What do you use your vehicle for"),
                    })
                  : undefined
              }
              options={vehicleUseOptions.map((v) => v)}
              helperText={getHelperText({
                errors: fields.vehicleUse.errors,
                invalidMessage: contentfulData.fields.vehicleUse.invalidErrorMessage,
                requiredMessage: contentfulData.fields.vehicleUse.requiredErrorMessage,
              })}
              onChange={(_, v) => handleButtonGtmEvents("What do you use your vehicle for", v)}
            />
          </FormControl>
          {isBusinessUse && (
            <ContentfulNotificationCard {...contentfulData.notifications.businessUseNotificationCard} />
          )}
          <SubmitButton disabled={disableSubmit}>Next</SubmitButton>
          <BackButton href={myRacUrl} onClick={() => logEvent("Back to myRAC")} />
        </Box>
      </form>
    </FormProvider>
  );
}
