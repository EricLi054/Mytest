export interface PAFVerificationAttributes {
  verifyLevel: string;
  unitType: string;
  unit: string;
  buildingNumber: string;
  subBuildingNumber: string;
  buildingName: string;
  buildingName2: string;
  buildingLevelType: string;
  buildingLevelNumber: string;
  postalDeliveryTypes: string;
  postalDeliveryNumber: string;
  allotmentLot: string;
  allotmentNumber: string;
  streetName: string;
  streetType: string;
  streetTypeSuffix: string;
  locality: string;
  stateName: string;
  stateCode: string;
  postcode: string;
  country: string;
}

export interface PAFVerificationData {
  type: string;
  id: string;
  attributes: PAFVerificationAttributes;
}
