"use client";

import type { FieldName } from "@conform-to/react";
import { useField, useInputControl } from "@conform-to/react";

import type { RacwaToggleButtonGroupProps } from "@racwa/react-components";
import { RacwaToggleButtonGroup } from "@racwa/react-components";

import useTooltip from "../../hooks/useTooltip";

export type ToggleButtonGroupProps = {
  name: FieldName<string>;
  options: string[];
  helperText?: string;
  onChange?: (event: React.MouseEvent<HTMLElement>, value: string) => void | Promise<void>;
} & Pick<RacwaToggleButtonGroupProps<string>, "id" | "label" | "sublabel" | "disabled" | "tooltipProps" | "onBlur">;

export function ToggleButtonGroup({
  name,
  options,
  helperText = "Please select an option",
  onChange,
  onBlur,
  ...props
}: ToggleButtonGroupProps) {
  const tooltipProps = useTooltip();

  const [meta] = useField(name);
  const { value, change: onControlChange, blur: onControlBlur, focus } = useInputControl(meta);
  const { errors } = meta;

  return (
    <RacwaToggleButtonGroup
      {...props}
      tooltipProps={
        props.tooltipProps
          ? {
              ...props.tooltipProps,
              ...tooltipProps,
              onClick: (e) => {
                tooltipProps.onClick();
                props.tooltipProps?.onClick?.(e);
              },
            }
          : undefined
      }
      exclusive
      required
      value={value}
      options={options}
      error={!!errors}
      helperText={errors ? helperText : undefined}
      onFocus={focus}
      onBlur={(e) => {
        onBlur?.(e);
        onControlBlur();
      }}
      onChange={(e, v) => {
        // RRL also does this, presumably to handle the gross types setup in the DS
        if (v === null || v === undefined) {
          return;
        }

        void onChange?.(e, v.toString());
        onControlChange(v.toString());
      }}
    />
  );
}
