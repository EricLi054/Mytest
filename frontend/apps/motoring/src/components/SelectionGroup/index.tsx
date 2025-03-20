"use client";

import type { FieldName } from "@conform-to/react";
import type { ReactNode } from "react";
import { useField, useInputControl } from "@conform-to/react";

import type { RacwaFormControlProps } from "@racwa/react-components";
import { RacwaFormControl, Selector } from "@racwa/react-components";

type Behaviour = "multichoice" | "exclusive";

type SelectionGroupValue<B extends Behaviour = Behaviour> = B extends "exclusive" ? string : string[];

type FormControlProps = Pick<
  RacwaFormControlProps,
  "label" | "sublabel" | "optional" | "optionalText" | "tooltipProps" | "helperText"
>;

export type SelectionGroupProps = FormControlProps & {
  id?: string;
  children: ReactNode;
  name: FieldName<SelectionGroupValue>;
  disabled?: boolean;
} & (
    | {
        exclusive: true;
        onChange?: (value: SelectionGroupValue<"exclusive">) => void | Promise<void>;
      }
    | {
        exclusive?: false;
        onChange?: (value: SelectionGroupValue<"multichoice">) => void | Promise<void>;
      }
  );

export const SelectionGroup = ({
  id = "selection-group",
  children,
  name,
  label,
  sublabel,
  optional,
  optionalText,
  tooltipProps,
  helperText = "Please select an option",
  exclusive,
  disabled,
  onChange,
}: SelectionGroupProps) => {
  const [meta] = useField(name);
  const { value, change: onControlChange, blur: onControlBlur, focus } = useInputControl(meta);

  const { errors } = meta;

  return (
    <RacwaFormControl
      {...{ label, sublabel, optional, optionalText, tooltipProps, disabled }}
      id={id}
      error={!!errors}
      helperText={errors ? helperText : undefined}
      fullWidth
      margin="none"
      onFocus={focus}
    >
      <Selector
        defaultValue={typeof value === "string" ? [value] : value}
        exclusive={exclusive}
        error={!!errors}
        disabled={disabled}
        onChange={(v) => {
          // conform's parseToZod will set the form value to undefined when the value is an empty string
          // https://conform.guide/api/zod/parseWithZod#tips
          if (!exclusive) {
            void onChange?.(v);
            onControlChange(v.length === 0 ? "" : v);
          } else {
            const newValue = v[0] ?? "";
            void onChange?.(newValue);
            onControlChange(newValue);
          }

          onControlBlur();
        }}
      >
        {children}
      </Selector>
    </RacwaFormControl>
  );
};

// Containers
SelectionGroup.Column = Selector.Column;
SelectionGroup.Row = Selector.Row;

// Cards
SelectionGroup.ListCard = Selector.ListCard;
SelectionGroup.SelectionCard = Selector.SelectionCard;

// Checkbox Items
SelectionGroup.CheckboxListItem = Selector.CheckboxListItem;

// Radio Items
SelectionGroup.RadioItem = Selector.RadioItem;
SelectionGroup.RadioListItem = Selector.RadioListItem;

export default SelectionGroup;
