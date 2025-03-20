"use client";

import type { VehicleCardInfo } from "#utils/getVehicleCardInfo";
import type { z } from "zod";
import { useActionState, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { FormProvider, getFormProps, getInputProps, useForm, useInputControl } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Button, FormControl, FormHelperText, FormLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import Grid from "@mui/material/Grid2";
import BackButton from "#components/BackButton";
import ContentfulNotificationCard from "#components/ContentfulNotificationCard";
import ContentfulTooltip, { generateContentfulTooltipProps } from "#components/ContentfulTooltip";
import FormLoadingModal from "#components/FormLoadingModal";
import SelectionGroup from "#components/SelectionGroup";
import SubmitButton from "#components/SubmitButton";
import { INVALID_ERROR } from "#constants";
import { logEvent, logFieldTouched, logPageView } from "#utils/analyticsTagging";
import { getHelperText } from "#utils/getHelperText";

import { CarGRFX001NoPadding, MotoGRFX016NoPadding } from "@racwa/react-components";
import { colors } from "@racwa/styles";
import { ToggleButtonGroup } from "@racwa/ui";

import type { GetVehicleByRegoAction, UpdateVehicleAction } from "./actions";
import type { UpdateVehicleContentfulSchema } from "./schema";
import { getUpdateYourVehiclePageUrl } from "../../routing";
import {
  isValidVehicleType,
  UpdateVehicleFormSchema,
  vehicleColourOptions,
  VehicleType,
  vehicleTypeOptions,
} from "./schema";

export type UpdateVehicleFormProps = {
  contentfulData: z.infer<typeof UpdateVehicleContentfulSchema>;
  updateVehicleAction: UpdateVehicleAction;
  getVehicleByRegoAction: GetVehicleByRegoAction;
  defaultValues?: {
    formData: z.infer<typeof UpdateVehicleFormSchema> | undefined;
    vehicleCardInfo: VehicleCardInfo | undefined;
  };
};

export default function UpdateVehicleForm({
  contentfulData,
  updateVehicleAction,
  getVehicleByRegoAction,
  defaultValues,
}: UpdateVehicleFormProps) {
  const [searchData, setSearchData] = useState<VehicleCardInfo | undefined>(defaultValues?.vehicleCardInfo);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!searchData);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [lastResult, action] = useActionState(updateVehicleAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate: ({ formData }) => parseWithZod(formData, { schema: UpdateVehicleFormSchema }),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: defaultValues?.formData,
  });

  const vehicleColourControl = useInputControl(fields.vehicleColour);
  const vehicleNotFoundControl = useInputControl(fields.vehicleNotFound);
  const vehicleSelectControl = useInputControl(fields.vehicleSelect);
  const vehicleRegoControl = useInputControl(fields.vehicleRego);

  const isVehicleSelected = fields.vehicleSelect.value === "true";
  const isVehicleOverweightOrOversize = !!searchData?.isOverweightOrOversize;
  const isVehicleTypeSelected = !!fields.vehicleType.value;

  useEffect(logPageView, []);

  const handleSearch = async () => {
    logEvent("Enter your registration to find your vehicle - Search");

    setLoading(true);
    setHasSearched(false);
    setHasSubmitted(false);
    setSearchData(undefined);

    form.update({ name: "vehicleColour", value: "", validated: false });
    form.update({ name: "vehicleSelect", value: "", validated: false });

    form.validate({ name: "vehicleRego" });
    form.validate({ name: "vehicleType" });

    const vehicleType = fields.vehicleType.value;

    if (
      fields.vehicleRego.valid &&
      !!fields.vehicleRego.value &&
      fields.vehicleType.valid &&
      !!fields.vehicleType.value &&
      isValidVehicleType(vehicleType)
    ) {
      try {
        const transformedRego = fields.vehicleRego.value.toUpperCase().trim().replace(/\s+/g, "");

        const result = await getVehicleByRegoAction({
          registrationNumber: transformedRego,
          vehicleType: vehicleType === "Car" ? "CAR" : "MOTORCYCLE",
        });

        const vehicleNotFound = !result;
        logEvent(vehicleNotFound ? "No results found" : "Vehicle found");
        form.update({ name: "vehicleNotFound", value: vehicleNotFound ? "true" : "false", validated: false });

        setSearchData(result);
        setHasSearched(true);
      } catch {
        return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
      }
    }
    setLoading(false);
  };

  const handleVehicleTypeChange = (value: string) => {
    const description = "Type of vehicle you're updating to";
    logFieldTouched(`${description}`);
    logEvent(`${description} - ${value}`);

    setHasSearched(false);
    setHasSubmitted(false);
    setSearchData(undefined);

    form.update({ name: "vehicleSelect", value: undefined, validated: false });
    form.update({ name: "vehicleRego", value: "", validated: false });
  };

  const handleVehicleSelect = (v: boolean) => {
    logEvent(`Vehicle selected - ${v.toString()}`);

    if (searchData?.isOverweightOrOversize && v) {
      logEvent("Oversize or overweight vehicle");
    }

    form.update({ name: "vehicleColour", value: "", validated: false });
  };

  return (
    <>
      <FormProvider context={form.context}>
        <form {...getFormProps(form)} action={action}>
          <FormLoadingModal open={loading} />
          <Grid container spacing={1}>
            <Grid size={12}>
              <FormControl error={!fields.vehicleType.valid}>
                <ToggleButtonGroup
                  id={fields.vehicleType.id}
                  name={fields.vehicleType.name}
                  label={contentfulData.fields.vehicleType.label}
                  tooltipProps={
                    contentfulData.fields.vehicleType.tooltipTitle && contentfulData.fields.vehicleType.tooltipContent
                      ? generateContentfulTooltipProps({
                          title: contentfulData.fields.vehicleType.tooltipTitle,
                          message: contentfulData.fields.vehicleType.tooltipContent,
                          onClick: () => logEvent("Tooltip - Vehicle type"),
                        })
                      : undefined
                  }
                  options={vehicleTypeOptions.map((v) => v)}
                  helperText={getHelperText({
                    errors: fields.vehicleType.errors,
                    invalidMessage: contentfulData.fields.vehicleType.invalidErrorMessage,
                    requiredMessage: contentfulData.fields.vehicleType.requiredErrorMessage,
                  })}
                  onChange={(_, v) => handleVehicleTypeChange(v)}
                />
              </FormControl>
            </Grid>
            {isVehicleTypeSelected && (
              <Grid size={12}>
                <FormControl error={!fields.vehicleRego.valid || (hasSubmitted && !hasSearched)} fullWidth>
                  <FormLabel htmlFor={fields.vehicleRego.id}>{contentfulData.fields.vehicleRego.label}</FormLabel>
                  {contentfulData.fields.vehicleRego.tooltipTitle &&
                    contentfulData.fields.vehicleRego.tooltipContent && (
                      <ContentfulTooltip
                        title={contentfulData.fields.vehicleRego.tooltipTitle}
                        message={contentfulData.fields.vehicleRego.tooltipContent}
                        onClick={() => logEvent("Tooltip - Vehicle registration")}
                      />
                    )}
                  <div style={{ display: "flex" }}>
                    <OutlinedInput
                      name="vehicleRego"
                      value={vehicleRegoControl.value ?? ""}
                      key={fields.vehicleRego.id}
                      id={fields.vehicleRego.id}
                      onChange={(e) => {
                        vehicleRegoControl.change(e.target.value.toUpperCase());
                        setHasSearched(false);
                        setHasSubmitted(false);
                        setSearchData(undefined);
                        vehicleSelectControl.change(undefined);
                      }}
                      onFocus={() => {
                        logFieldTouched("Enter your registration to find your vehicle");
                      }}
                      placeholder={contentfulData.fields.vehicleRego.placeholder}
                      fullWidth
                      inputProps={{ maxLength: 9 }}
                    />
                    <Button
                      sx={{
                        color: colors.white,
                        backgroundColor: colors.dieselDeepest,
                        ":hover": {
                          backgroundColor: colors.dieselDeepest,
                          color: colors.racYellow,
                        },
                        width: "98px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "8px 16px",
                      }}
                      onClick={handleSearch}
                    >
                      Search
                    </Button>
                  </div>
                  <FormHelperText>
                    {getHelperText({
                      errors: hasSubmitted && !hasSearched ? [INVALID_ERROR] : fields.vehicleRego.errors,
                      requiredMessage: contentfulData.fields.vehicleRego.requiredErrorMessage,
                      invalidMessage: contentfulData.fields.vehicleRego.invalidErrorMessage,
                    })}
                  </FormHelperText>
                </FormControl>
              </Grid>
            )}
            <Grid size={12}>
              {!searchData ? (
                <>
                  {hasSearched && (
                    <FormControl error={!fields.vehicleNotFound.valid}>
                      <FormLabel id="no-results-label">{contentfulData.fields.vehicleNotFound.label}</FormLabel>
                      <input
                        key={fields.vehicleNotFound.id}
                        id={fields.vehicleNotFound.id}
                        value={vehicleNotFoundControl.value}
                        type="hidden"
                      />
                      <FormHelperText>
                        {getHelperText({
                          errors: fields.vehicleNotFound.errors,
                          requiredMessage: contentfulData.fields.vehicleNotFound.requiredErrorMessage,
                          invalidMessage: contentfulData.fields.vehicleNotFound.invalidErrorMessage,
                        })}
                      </FormHelperText>
                    </FormControl>
                  )}
                </>
              ) : (
                <SelectionGroup
                  name={fields.vehicleSelect.name}
                  exclusive
                  label={contentfulData.fields.vehicleSelect.label}
                  helperText={getHelperText({
                    errors: fields.vehicleSelect.errors,
                    requiredMessage: contentfulData.fields.vehicleSelect.requiredErrorMessage,
                    invalidMessage: contentfulData.fields.vehicleSelect.invalidErrorMessage,
                  })}
                >
                  <SelectionGroup.SelectionCard
                    id="vehicle-select"
                    title={searchData.title}
                    value="true"
                    subtitle={searchData.subtitle}
                    cardIcon={
                      fields.vehicleType.value === VehicleType.Car ? <CarGRFX001NoPadding /> : <MotoGRFX016NoPadding />
                    }
                    onSelect={(_, v) => handleVehicleSelect(v)}
                  />
                </SelectionGroup>
              )}
            </Grid>
            {isVehicleSelected ? (
              <Grid size={12}>
                {isVehicleOverweightOrOversize && (
                  <ContentfulNotificationCard
                    {...contentfulData.notifications.oversizeOrOverweightVehicle}
                    style={{ marginTop: "16px", marginBottom: "8px" }}
                  />
                )}
                <FormControl error={!fields.vehicleColour.valid} fullWidth>
                  <FormLabel htmlFor={fields.vehicleColour.id} id="vehicle-colour-label">
                    {contentfulData.fields.vehicleColour.label}
                  </FormLabel>
                  <Select
                    {...getInputProps(fields.vehicleColour, { type: "text" })}
                    key={fields.vehicleColour.id}
                    id={fields.vehicleColour.id}
                    aria-labelledby="vehicle-colour-label"
                    name={fields.vehicleColour.name}
                    displayEmpty
                    fullWidth
                    value={vehicleColourControl.value ?? ""}
                    onChange={(value) => {
                      vehicleColourControl.change(value.target.value);
                    }}
                    onClose={() => vehicleColourControl.blur()}
                    onOpen={() => {
                      logFieldTouched("Vehicle colour");
                    }}
                  >
                    <MenuItem key={"placeholder"} value={""} disabled>
                      {contentfulData.fields.vehicleColour.placeholder}
                    </MenuItem>

                    {vehicleColourOptions.map((color) => (
                      <MenuItem key={color} value={color}>
                        {color}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {getHelperText({
                      errors: fields.vehicleColour.errors,
                      requiredMessage: contentfulData.fields.vehicleColour.requiredErrorMessage,
                      invalidMessage: contentfulData.fields.vehicleColour.invalidErrorMessage,
                    })}
                  </FormHelperText>
                </FormControl>
              </Grid>
            ) : (
              <>
                {isVehicleTypeSelected && (
                  <Grid size={12}>
                    <ContentfulNotificationCard
                      {...contentfulData.notifications.cantFindVehicle}
                      style={{ marginTop: "16px" }}
                    />
                  </Grid>
                )}
              </>
            )}
            <Grid size={12}>
              <SubmitButton onClick={() => setHasSubmitted(true)}>Next</SubmitButton>
              <BackButton href="your-vehicle" onClick={() => logEvent("Back to Your vehicle")} />
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </>
  );
}
