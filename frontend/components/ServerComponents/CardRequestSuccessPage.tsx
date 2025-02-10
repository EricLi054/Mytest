import { PageTemplateContainer } from './PageTemplateContainer';
import { PageTemplateHeader1 } from './PageTemplateHeader1';
import { PageTextCard } from './PageTextCard';
import { PageImageTextCard } from './PageImageTextCard';
import { type EngineeredJourneyProps } from '@/types/EngineeredJourneyProps';
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
  OnlineShopCardTitle
} from './CardRequestSuccessPage.content';
import CardRequestSuccessPageFooter, { type CardRequestSuccessPageFooterProps } from './CardRequestSuccessPageFooter';

export interface CardRequestSuccessPageProps
  extends EngineeredJourneyProps,
    Partial<CardRequestSuccessPageFooterProps> {}

const CardRequestSuccessPage = ({
  engineeredContent,
  digitalCardDetails,
  MyRACButton,
  ProfileButton
}: CardRequestSuccessPageProps) => {
  if (!engineeredContent) {
    return null;
  }
  return (
    <PageTemplateContainer>
      <PageTemplateHeader1 HeaderIcon={HeaderIcon(engineeredContent)} HeaderText={HeaderText(engineeredContent)} />

      {digitalCardDetails?.isSuccess && digitalCardDetails?.value?.digitalCardPassIsActive && (
        <PageImageTextCard
          Title={DigitalCardTitle(engineeredContent)}
          Content={DigitalCardContent(engineeredContent)}
          CardImage={DigitalCardImage(engineeredContent)}
          cardDetails={digitalCardDetails}
        />
      )}
      {(!digitalCardDetails?.isSuccess || !digitalCardDetails?.value?.digitalCardPassIsActive) && (
        <PageTextCard
          Icon={OnlineShopCardIcon(engineeredContent)}
          Title={OnlineShopCardTitle(engineeredContent)}
          Content={OnlineShopCardContentInline}
        />
      )}

      <CardRequestSuccessPageFooter
        MyRACButton={MyRACButton || CardSuccessMyRACButton(engineeredContent)}
        ProfileButton={ProfileButton || CardSuccessProfileButton(engineeredContent)}
      />
    </PageTemplateContainer>
  );
};

export default CardRequestSuccessPage;
