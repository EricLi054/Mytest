"use client";

import type { SyntheticEvent } from "react";
import type { z } from "zod";
import { useMemo, useState } from "react";
import { Autocomplete, CircularProgress } from "@mui/material";
import { logEvent, logFieldTouched } from "#utils/analyticsTagging";
import { useDebouncedCallback } from "use-debounce";

import { RacwaFormControl } from "@racwa/react-components";

import type { FieldSchema, ParsedAddressValue } from "../schema";
import type { SearchAddressFunction, ValidateSelectedAddressFunction } from "../util";
import { StyledTextInput } from "../styled";

const DEBOUNCE_DELAY = 500;

export type InternalAddressInputProps = {
  searchAddress: SearchAddressFunction;
  validateSelectedAddress: ValidateSelectedAddressFunction;
  logFormFieldTouched: () => void;
} & z.infer<typeof FieldSchema>;

export const InternalAddressInput = ({
  input,
  label,
  required,
  notFoundMessage,
  refineFurtherMessage,
  apiErrorMessage,
  tooltipTitle,
  tooltipText,
  placeholder,
  meta,
  logFormFieldTouched,
  searchAddress,
  validateSelectedAddress,
}: InternalAddressInputProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const [addressListError, setAddressListError] = useState<boolean>(false);
  const [notFoundError, setNotFoundError] = useState<boolean>(false);

  const [options, setOptions] = useState<z.infer<z.ZodArray<typeof ParsedAddressValue>>>([]);
  const [inputValue, setInputValue] = useState<z.infer<typeof ParsedAddressValue> | null>(
    typeof input.value === "string" ? { value: input.value, label: input.value } : null,
  );

  const onChange = async (selectedValue: z.infer<typeof ParsedAddressValue> | null) => {
    if (selectedValue) {
      const validatedAddress = await validateSelectedAddress(selectedValue);
      input.onChange(validatedAddress);
    } else {
      input.onChange(null);
    }
    setInputValue(selectedValue);
  };

  const debouncedInputChange = useDebouncedCallback(
    async (_: SyntheticEvent<Element, Event> | null, inputtedAddress: string) => {
      if (inputtedAddress.length > 6) {
        setLoading(true);
        const { options, error } = await searchAddress(inputtedAddress);
        setOptions(options);
        setNotFoundError(options.length === 0);
        setAddressListError(error);
        setLoading(false);
      } else {
        setOptions([]);
      }
    },
    DEBOUNCE_DELAY,
  );

  const noOptionsText = useMemo(() => {
    if (addressListError) {
      return apiErrorMessage;
    } else if (notFoundError) {
      return notFoundMessage;
    } else {
      return refineFurtherMessage;
    }
  }, [addressListError, refineFurtherMessage, apiErrorMessage, notFoundError, notFoundMessage]);

  const tooltipProps = useMemo(() => {
    return tooltipTitle || tooltipText
      ? {
          open,
          title: tooltipTitle,
          message: tooltipText,
          onClickClose: () => {
            setOpen(false);
          },
          onClick: () => {
            setOpen(true);
            logEvent(`Tooltip - ${tooltipTitle}`);
          },
        }
      : undefined;
  }, [tooltipTitle, tooltipText, open]);

  return (
    <RacwaFormControl
      label={label}
      tooltipProps={tooltipProps}
      fullWidth={true}
      required={required}
      error={meta.modified && meta.error !== undefined}
      helperText={meta.modified ? (meta.error ?? undefined) : undefined}
      passDownErrorProp={false}
    >
      <Autocomplete
        {...input}
        sx={{ minWidth: 150 }}
        size="small"
        options={options}
        loading={loading}
        noOptionsText={noOptionsText}
        isOptionEqualToValue={(option, value) => {
          return option.label === value.label;
        }}
        onInputChange={async (event, value) => {
          await debouncedInputChange(event, value);
        }}
        onChange={async (_, value) => {
          await onChange(value);
          logFieldTouched(`${label} - Autocomplete selection`);
        }}
        filterOptions={(option) => option}
        value={inputValue}
        renderInput={(params) => (
          <StyledTextInput
            {...params}
            placeholder={placeholder}
            variant="outlined"
            margin="none"
            type="search"
            error={meta.modified && meta.error !== undefined}
            slotProps={{
              input: {
                ...params.InputProps,
                inputMode: "text",
                onFocus: logFormFieldTouched,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} sx={{ marginRight: 2 }} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />
    </RacwaFormControl>
  );
};
