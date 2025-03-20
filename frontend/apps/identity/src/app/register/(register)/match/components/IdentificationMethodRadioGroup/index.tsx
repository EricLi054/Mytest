"use client";

import { Children, cloneElement, isValidElement, useState } from "react";
import { FormLabel, RadioGroup } from "@mui/material";
import { logFieldTouched } from "#utils/analyticsTagging";

import type { IdentificationMethodRadioItemProps } from "../IdentificationMethodRadioItem";

const renderChildren = (children: React.ReactNode, value: string) =>
  Children.map(children, (child) => {
    if (isValidElement<IdentificationMethodRadioItemProps>(child)) {
      if (!value) {
        return cloneElement(child);
      }
      const checked = child.props.value === value;
      return cloneElement(child, { checked: checked });
    }
    return;
  });

export type IdentificationMethodRadioGroupProps = Omit<
  React.ComponentProps<typeof RadioGroup>,
  "classes" | "id" | "defaultValue"
> & {
  defaultValue: string;
};

export const IdentificationMethodRadioGroup: React.FC<IdentificationMethodRadioGroupProps> = ({
  children,
  defaultValue,
  onChange,
  ...props
}: IdentificationMethodRadioGroupProps) => {
  const radioGroupId = "identification-method-radio-group";
  const labelId = `${radioGroupId}-label`;
  const label = "Select an option to verify your identity";
  const [currentValue, setValue] = useState(defaultValue);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setValue(value);
    logFieldTouched(label);
    if (onChange) {
      onChange(e, value);
    }
  };
  return (
    <>
      <FormLabel id={labelId} htmlFor={radioGroupId} aria-label={label} component="legend" sx={{ marginBottom: 0 }}>
        {label}
      </FormLabel>
      <RadioGroup {...props} id={radioGroupId} aria-labelledby={labelId} value={currentValue} onChange={handleChange}>
        {renderChildren(children, currentValue)}
      </RadioGroup>
    </>
  );
};

export default IdentificationMethodRadioGroup;
