import type { DigitalCardDetailsSchema } from "#graphql/person/queries/schema";
import type { JSX } from "react";
import type { z } from "zod";
import { Typography } from "@mui/material";

import { colors } from "@racwa/styles";

import {
  CardContainer,
  CardContentSection,
  CardImageWrapper,
  ContentSection,
  DesktopOnlyCardImageSection,
  MobileOnlyCardImageSection,
} from "./PageImageTextCard.styled";
import { PageImageTextCardAddToWallet } from "./PageImageTextCardAddToWallet";

type PageImageTextCardProps = {
  CardImage: () => JSX.Element;
  Title: () => JSX.Element;
  Content: () => JSX.Element;
  cardDetails?: z.infer<typeof DigitalCardDetailsSchema>;
};

export const PageImageTextCard: React.FC<PageImageTextCardProps> = ({ CardImage, Title, Content, cardDetails }) => {
  return (
    <CardContainer container>
      <DesktopOnlyCardImageSection container>
        <CardImageWrapper>
          <CardImage />
        </CardImageWrapper>
      </DesktopOnlyCardImageSection>

      <CardContentSection container>
        <Typography variant="h3" color={colors.dieselDeep}>
          <Title />
        </Typography>
        <MobileOnlyCardImageSection container>
          <CardImageWrapper>
            <CardImage />
          </CardImageWrapper>
        </MobileOnlyCardImageSection>
        <ContentSection container>
          <Typography variant="body1" color={colors.dieselDeeper}>
            <Content />
          </Typography>
          <PageImageTextCardAddToWallet cardDetails={cardDetails} />
        </ContentSection>
      </CardContentSection>
    </CardContainer>
  );
};
