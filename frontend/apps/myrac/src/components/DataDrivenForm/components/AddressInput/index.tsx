import type { UseFieldApiConfig } from "@data-driven-forms/react-form-renderer";
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import { useGTMFormEvents } from "#components/DataDrivenForm/hooks";

import { InternalAddressInput } from "./InternalAddressInput";
import { FieldSchema } from "./schema";
import { searchAddress, validateSelectedAddress } from "./util";

export const RacwaAddressInput = (props: UseFieldApiConfig) => {
  const fieldProps = useFieldApi(props);
  const validatedFieldProps = FieldSchema.parse(fieldProps);

  const { logFormFieldTouched } = useGTMFormEvents(props);

  return (
    <InternalAddressInput
      {...validatedFieldProps}
      logFormFieldTouched={logFormFieldTouched}
      searchAddress={searchAddress}
      validateSelectedAddress={validateSelectedAddress}
    />
  );
};
