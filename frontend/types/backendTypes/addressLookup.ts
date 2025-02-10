export interface AddressLookupDataAttributes {
  partialAddress: string;
  picklist: string;
  postcode: string;
  state: string;
  score: string;
}

export interface AddressLookupData {
  type: string;
  id: string;
  attributes: AddressLookupDataAttributes;
}
