"use client";

import BarcodeClient from "./Barcode";
import { StyledBarcodeWrapper, StyledCardBack, StyledCardContent, StyledCardHeading } from "./index.styled";

export type DigitalCardBackProps = {
  membershipCardNumber?: string;
};
const DigitalCardBack: React.FC<DigitalCardBackProps> = ({ membershipCardNumber }) => {
  if (!membershipCardNumber) {
    console.error("No barcode provided to DigitalCardBack");
    return null;
  }
  return (
    <StyledCardBack>
      <StyledCardContent>
        <StyledCardHeading>Scan and save</StyledCardHeading>
        <StyledBarcodeWrapper>
          <BarcodeClient membershipCardNumber={membershipCardNumber} />
        </StyledBarcodeWrapper>
      </StyledCardContent>
    </StyledCardBack>
  );
};

export default DigitalCardBack;
