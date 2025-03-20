import type { EngineeredJourneyProps } from "#types/EngineeredJourneyProps";
import { getPerson } from "#graphql/person/queries";

import MembershipPage from ".";

const MembershipPageRenderer: React.FC<EngineeredJourneyProps> = async ({ engineeredContent }) => {
  try {
    const person = await getPerson();
    return <MembershipPage person={person} engineeredContent={engineeredContent} />;
  } catch {
    // Handle error
    return null;
  }
};

export default MembershipPageRenderer;
