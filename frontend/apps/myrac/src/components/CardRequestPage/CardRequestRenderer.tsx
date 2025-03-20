"use server";

import type { EngineeredJourneyProps } from "#types/EngineeredJourneyProps";
import { requestPhysicalCard } from "#graphql/person/mutations/requestPhysicalCard";
import { getPerson } from "#graphql/person/queries";

import CardRequestForm from "./index";

const CardRequestRenderer: React.FC<EngineeredJourneyProps> = async () => {
  try {
    const person = await getPerson({ overrideMasking: true });

    return (
      <CardRequestForm unmaskedFormattedAddress={person.formattedAddress} requestPhysicalCard={requestPhysicalCard} />
    );
  } catch {
    // Handle error
    return null;
  }
};

export default CardRequestRenderer;
