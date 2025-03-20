import type { PersonSchema } from "#graphql/person/queries/schema";
import type { EngineeredJourneyProps } from "#types/EngineeredJourneyProps/index";
import type { z } from "zod";
import { PageTemplateContainer } from "#components/shared/PageTemplateContainer";

import CardRequestSuccessPageFooter from "./components/CardRequestSuccessPageFooter";
import { PageHeader } from "./components/PageHeader";
import { PageImageTextCard } from "./components/PageImageTextCard";
import { PageTextCard } from "./components/PageTextCard";
import {
  CardSuccessMyRACButton,
  CardSuccessProfileButton,
  DigitalCardContent,
  DigitalCardImage,
  DigitalCardTitle,
  HeaderIcon,
  HeaderText,
  OnlineShopCardContentInline,
  OnlineShopCardIcon,
  OnlineShopCardTitle,
} from "./index.content";

type CardRequestSuccessPageProps = {
  person: z.infer<typeof PersonSchema>;
} & EngineeredJourneyProps;

const CardRequestSuccessPage: React.FC<CardRequestSuccessPageProps> = ({ engineeredContent, person }) => {
  const { digitalCardDetails } = person;
  if (!engineeredContent || !digitalCardDetails) {
    return null;
  }

  return (
    <PageTemplateContainer>
      <PageHeader HeaderIcon={HeaderIcon(engineeredContent)} HeaderText={HeaderText(engineeredContent, person)} />
      {digitalCardDetails.isActive && (
        <PageImageTextCard
          Title={DigitalCardTitle(engineeredContent)}
          Content={DigitalCardContent(engineeredContent)}
          CardImage={DigitalCardImage(engineeredContent)}
          cardDetails={digitalCardDetails}
        />
      )}

      {!digitalCardDetails.isActive && (
        <PageTextCard
          Icon={OnlineShopCardIcon(engineeredContent)}
          Title={OnlineShopCardTitle(engineeredContent)}
          Content={OnlineShopCardContentInline}
        />
      )}
      <CardRequestSuccessPageFooter
        MyRACButton={CardSuccessMyRACButton(engineeredContent)}
        ProfileButton={CardSuccessProfileButton(engineeredContent)}
      />
    </PageTemplateContainer>
  );
};

export default CardRequestSuccessPage;
