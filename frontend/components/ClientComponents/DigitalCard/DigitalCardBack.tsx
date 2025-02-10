import { BarcodeClient } from './Barcode';
import { StyledBarcodeWrapper, StyledCardBack, StyledCardContent, StyledCardHeading } from './DigitalCardBack.styled';

export interface DigitalCardBackProps {
  membershipCardNumber?: string;
}
const DigitalCardBack: React.FC<DigitalCardBackProps> = ({ membershipCardNumber }) => {
  if (!membershipCardNumber) {
    console.error('No barcode provided to DigitalCardBack');
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
