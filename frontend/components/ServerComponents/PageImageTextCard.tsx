import { Typography } from '@mui/material';
import { colors } from '@racwa/styles';
import {
  CardContainer,
  CardContentSection,
  CardImageWrapper,
  DesktopOnlyCardImageSection,
  MobileOnlyCardImageSection,
  ContentSection
} from '../StyledComponents/PageImageTextCard.styled';
import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';
import { PageImageTextCardAddToWallet } from '../ClientComponents/DigitalCard/PageImageTextCardAddToWallet';

interface PageImageTextCardProps {
  CardImage: () => JSX.Element;
  Title: () => JSX.Element;
  Content: () => JSX.Element;
  cardDetails: DigitalCardDetails;
}

export const PageImageTextCard: React.FC<PageImageTextCardProps> = ({ CardImage, Title, Content, cardDetails }) => {
  return (
    <CardContainer container>
      {CardImage && (
        <DesktopOnlyCardImageSection container>
          <CardImageWrapper item>
            <CardImage />
          </CardImageWrapper>
        </DesktopOnlyCardImageSection>
      )}

      <CardContentSection container>
        <Typography variant='h3' color={colors.dieselDeep}>
          <Title />
        </Typography>
        {CardImage && (
          <MobileOnlyCardImageSection container>
            <CardImageWrapper item>
              <CardImage />
            </CardImageWrapper>
          </MobileOnlyCardImageSection>
        )}
        <ContentSection container>
          <Typography variant='body1' color={colors.dieselDeeper}>
            <Content />
          </Typography>
          <PageImageTextCardAddToWallet cardDetails={cardDetails} />
        </ContentSection>
      </CardContentSection>
    </CardContainer>
  );
};
