import type { EngineeredJourneyProps } from "#types/EngineeredJourneyProps";
import { getPerson } from "#graphql/person/queries";

import MemberDetailsBar from ".";

const MemberDetailsBarRenderer: React.FC<EngineeredJourneyProps> = async ({ engineeredContent }) => {
  try {
    const person = await getPerson();

    return <MemberDetailsBar person={person} engineeredContent={engineeredContent} />;
  } catch {
    // Handle error
    return null;
  }
};

export default MemberDetailsBarRenderer;
