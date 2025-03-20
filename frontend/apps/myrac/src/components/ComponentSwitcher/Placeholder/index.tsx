import type { EngineeredJourneyProps } from "#types/EngineeredJourneyProps";
import CardRequestRenderer from "#components/CardRequestPage/CardRequestRenderer";
import CardRequestSuccessRenderer from "#components/CardRequestSuccessPage/CardRequestSuccessRenderer";
import MemberDetailsBarRenderer from "#components/MemberDetailsBar/MemberDetailsBarRenderer";
import MembershipPageRenderer from "#components/MembershipPage/MembershipPageRenderer";
import PolicyCardsRenderer from "#components/PolicyDetailsRenderer";
import { EngineeredContentCollection } from "#types/EngineeredJourneyProps";

import type { ComponentSwitchableProps } from "../types";
import { getPlaceholderData } from "./data";

const placeholderTypeMap: Record<string, React.FC<EngineeredJourneyProps>> = {
  "Policy Cards": PolicyCardsRenderer,
  "Member Details Bar": MemberDetailsBarRenderer,
  Membership: MembershipPageRenderer,
  CardRequestForm: CardRequestRenderer,
  CardRequestSuccess: CardRequestSuccessRenderer,
};
async function Placeholder({ id }: ComponentSwitchableProps) {
  const resultData = await getPlaceholderData(id);
  if (!resultData) {
    return undefined;
  }

  const Component = placeholderTypeMap[resultData.placeholderType];

  if (!Component) {
    console.error("Error: PlaceHolder.tsx Component not found for placeholderType: ", resultData.placeholderType);
    return undefined;
  }
  return (
    <Component engineeredContent={new EngineeredContentCollection(...resultData.engineeredContentCollection.items)} />
  );
}

export default Placeholder;
