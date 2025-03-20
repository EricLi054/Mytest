"use client";

import { FormControlLabel, formControlLabelClasses, Radio, styled } from "@mui/material";
import { logCustomEvent } from "#utils/analyticsTagging";

const StyledRadio = styled(Radio)(({ theme }) => ({
  padding: theme.spacing(1),
  paddingLeft: 0,
}));

const StyledFormControlLabel = styled(FormControlLabel)(() => ({
  alignSelf: "stretch",
  width: "100%",
  padding: 0,
  margin: 0,
  [`& .${formControlLabelClasses.label}`]: {
    padding: 0,
    fontWeight: 300,
    fontSize: "18px",
  },
}));

const generateId = (prefix: string, suffix: string) => `${prefix}-${suffix}`;

export type IdentificationMethodRadioItemProps = Omit<
  React.ComponentProps<typeof FormControlLabel>,
  "classes" | "control" | "value" | "label" | "id" | "labelPlacement"
> & {
  label: string;
  value: string;
  checked: boolean;
};

export const IdentificationMethodRadioItem: React.FC<IdentificationMethodRadioItemProps> = ({
  label,
  value,
  checked,
  ...props
}: IdentificationMethodRadioItemProps) => {
  const id = generateId("identification-method-radio-item", value);
  return (
    <StyledFormControlLabel
      {...props}
      id={generateId(id, "form-control-label")}
      value={value}
      checked={checked}
      control={<StyledRadio id={generateId(id, "input")} inputProps={{ "aria-checked": checked }} />}
      label={<span id={generateId(id, "label")}>{label}</span>}
      labelPlacement="end"
      aria-label={`${label} identification method option`}
      onClick={() => logCustomEvent(label)}
    />
  );
};

export default IdentificationMethodRadioItem;
