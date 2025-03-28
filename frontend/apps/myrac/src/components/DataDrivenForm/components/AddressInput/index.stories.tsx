import type { StoryFn } from "@storybook/react";
import { screen, userEvent } from "@storybook/test";

import type { InternalAddressInputProps } from "./InternalAddressInput";
import { InternalAddressInput } from "./InternalAddressInput";

export default {
  title: "MyRAC/Components/Data Driven Forms/Address Input",
  component: InternalAddressInput,
  tags: ["@racwa/myrac"],
};

const wait = (timeout: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const mockSearchAddress = async (error: boolean, empty: boolean) => {
  await wait(1000);
  return {
    options: empty
      ? []
      : [
          {
            value: "Address 1",
            label: "Address 1",
          },
          {
            value: "Address 2",
            label: "Address 2",
          },
          {
            value: "Address 3",
            label: "Address 3",
          },
        ],
    error,
  };
};

const mockValidateAddress = async (error: boolean) => {
  await wait(1000);
  return error
    ? null
    : {
        dpid: "123",
        buildingName: "Building Name",
        subBuildingNumber: "Sub Building Number",
        unitNumber: "Unit Number",
        lotNumber: "Lot Number",
        houseNumber: "House Number",
        streetName: "Street Name",
        poBox: "PO Box",
        suburb: "Suburb",
        state: "State",
        postcode: "Postcode",
        country: "Country",
      };
};

const mockInput = {
  value: "",
  onChange: () => {
    console.log("Change");
  },
};

const mockMeta = {
  modified: false,
  error: undefined,
  initial: "",
};

const AddressStoryTemplate: StoryFn<InternalAddressInputProps> = (props) => <InternalAddressInput {...props} />;

const sharedProps = {
  input: mockInput,
  label: "Address field",
  notFoundMessage: "Not found",
  refineFurtherMessage: "Refine further",
  apiErrorMessage: "API error",
  tooltipTitle: "Tooltip title",
  tooltipText: "Tooltip text",
  placeholder: "Enter address",
  logFormFieldTouched: () => {
    console.log("Field touched");
  },
};

export const Default = AddressStoryTemplate.bind({});
Default.args = {
  ...sharedProps,
  required: true,
  meta: mockMeta,
  searchAddress: async () => await mockSearchAddress(false, false),
  validateSelectedAddress: async () => await mockValidateAddress(false),
};
Default.play = async () => {
  const input = screen.getByRole("combobox");
  await userEvent.type(input, "Address");
};

export const SearchNotFoundError = AddressStoryTemplate.bind({});
SearchNotFoundError.args = {
  ...sharedProps,
  required: true,
  meta: mockMeta,
  searchAddress: async () => await mockSearchAddress(false, true),
  validateSelectedAddress: async () => await mockValidateAddress(false),
};
SearchNotFoundError.play = async () => {
  const input = screen.getByRole("combobox");
  await userEvent.type(input, "Address");
};

export const SearchAPIError = AddressStoryTemplate.bind({});
SearchAPIError.args = {
  ...sharedProps,
  required: true,
  meta: mockMeta,
  searchAddress: async () => await mockSearchAddress(true, true),
  validateSelectedAddress: async () => await mockValidateAddress(false),
};
SearchAPIError.play = async () => {
  const input = screen.getByRole("combobox");
  await userEvent.type(input, "Address");
};
