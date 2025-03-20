"use server";

import type { EngineeredJourneyProps } from "#types/EngineeredJourneyProps";
import { getPerson } from "#graphql/person/queries";

import CardRequestSuccessPage from ".";

const CardRequestSuccessRenderer: React.FC<EngineeredJourneyProps> = async ({ engineeredContent }) => {
  const person = await getPerson();
  return <CardRequestSuccessPage engineeredContent={engineeredContent} person={person} />;
};

export default CardRequestSuccessRenderer;
