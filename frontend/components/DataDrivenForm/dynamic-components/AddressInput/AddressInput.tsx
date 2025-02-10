'use client';
import { addressQuery } from '@/graphql/queries/addressQuery';
import getData from '@/graphql/getData';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import { type SyntheticEvent, useCallback, useMemo, useState } from 'react';
import { TextField, Autocomplete, CircularProgress, styled } from '@mui/material';
import { RacwaFormControl } from '@racwa/react-components';
import { useDebouncedCallback } from 'use-debounce';
import { validateAddressQuery } from '@/graphql/queries/validateAddress';
import { logEvent, logFieldTouched } from '@/utilities/analyticsTagging';
import { useGTMFormEvents } from '../../hooks/useGTMFormEvents';
import { type PAFVerificationData } from '@/types/backendTypes/addressValidation';
import { type AddressLookupData } from '@/types/backendTypes/addressLookup';

const StyledTextInput = styled(TextField)({
  '& > div': {
    paddingRight: '50px !important'
  },
  '& input::-webkit-search-cancel-button': {
    display: 'none'
  },
  '&&&& input': {
    paddingBottom: '4.5px',
    paddingLeft: '6px',
    paddingRight: '4px',
    paddingTop: '4.5px'
  }
});

export const parseAddressResponse = (res: any) => {
  const options = res?.addressList?.data?.map((address: AddressLookupData) => ({
    value: address?.id,
    label: address?.attributes?.partialAddress
  }));
  const error = res?.errors?.length > 0;

  return { options: options ?? [], error };
};

export const validateAddress = async (value: any) => {
  const validation = await getData(validateAddressQuery(value.value));
  if (!validation?.validatePAF?.data) return;

  const data = validation.validatePAF.data as PAFVerificationData;
  if (data?.id) {
    const { id, attributes } = data;
    value.dpid = id;
    value.buildingName = attributes.buildingName;
    value.subBuildingNumber = attributes.subBuildingNumber;
    value.unitNumber = attributes.unit;
    value.lotNumber = attributes.allotmentNumber;
    value.houseNumber = attributes.buildingNumber;
    value.streetName =
      attributes.postalDeliveryNumber !== ''
        ? `PO Box ${attributes.postalDeliveryNumber}`
        : `${attributes.streetName}${attributes.streetType ? ` ${attributes.streetType}` : ''}`;
    value.poBox = attributes.postalDeliveryNumber !== '' ? `PO Box ${attributes.postalDeliveryNumber}` : '';
    value.suburb = attributes.locality;
    value.state = attributes.stateCode;
    value.postcode = attributes.postcode;
    value.country = attributes.country;
  }
};

export const RacwaAddressInput = (props: any) => {
  const {
    input,
    label,
    required,
    notFoundMessage,
    refineFurtherMessage,
    apiErrorMessage,
    helperText,
    tooltipTitle,
    tooltipText,
    placeholder,
    meta
  } = useFieldApi(props);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [hasMinimumInput, setHasMinimumInput] = useState<boolean>(false);
  const [addressListError, setAddressListError] = useState<boolean>(false);
  const { logFormFieldTouched } = useGTMFormEvents(props);

  const onChange = useCallback(
    async (selectedValue: any) => {
      if (selectedValue) {
        await validateAddress(selectedValue);
      }
      input?.onChange(selectedValue);
    },
    [input]
  );

  const debouncedInputChange = useDebouncedCallback(async (event: SyntheticEvent<Element, Event>, value: string) => {
    if (value.length > 6) {
      setLoading(true);
      setHasMinimumInput(true);
      const data = await getData(addressQuery(value));
      const { options, error } = parseAddressResponse(data);
      setAddressListError(error);
      setOptions(options);
      if (event === null && options.length > 0) {
        // event is null on initial load but not on subsequent input changes, this gets the string from member central and gets the QAS data
        await onChange(options[0]);
      }
      setLoading(false);
    } else {
      setHasMinimumInput(false);
      setOptions([]);
    }
  }, 500);

  const noOptionsText = useMemo(() => {
    if (addressListError) return apiErrorMessage ?? 'Error loading address list';
    else if (notFoundMessage) return hasMinimumInput ? notFoundMessage : refineFurtherMessage;
    // TODO: add extra piece of logic to differentiate between no address found and need to enter more characters
    return 'No options';
  }, [addressListError, hasMinimumInput, refineFurtherMessage, apiErrorMessage, notFoundMessage]);

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
            logEvent(`Tooltip - ${tooltipTitle as string}`);
          }
        }
      : undefined;
  }, [tooltipTitle, tooltipText, open]);

  return (
    <RacwaFormControl
      label={label}
      sublabel={helperText}
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
        size='small'
        options={options}
        loading={loading}
        noOptionsText={noOptionsText}
        isOptionEqualToValue={(option, value) => {
          return typeof value !== 'object' || option.label === value.label; // typeof check stops unnecessary warning
        }} // issue in git for this throwing unnecessary warning https://github.com/mui/material-ui/issues/29727
        onInputChange={async (event, value) => {
          await debouncedInputChange(event, value);
        }}
        onChange={async (_, value) => {
          await onChange(value);
          logFieldTouched(`${label as string} - Autocomplete selection`);
        }}
        value={input.value}
        renderInput={(params) => (
          <StyledTextInput
            {...params}
            placeholder={placeholder}
            variant='outlined'
            margin='none'
            type='search'
            error={meta.modified && meta.error !== undefined}
            InputProps={{
              ...params.InputProps,
              inputMode: 'text',
              onFocus: logFormFieldTouched,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color='inherit' size={20} sx={{ marginRight: 2 }} /> : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
      />
    </RacwaFormControl>
  );
};
