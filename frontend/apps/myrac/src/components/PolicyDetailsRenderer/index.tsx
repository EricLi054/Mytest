import type { EngineeredJourneyProps } from "#types/EngineeredJourneyProps";
import { Suspense } from "react";
import { getPolicyDetails } from "#graphql/policyDetails";
import { logError } from "#utils/logging";

import type { PolicyDetailsCardContent } from "./types";
import DashboardSystemError from "../DashboardSystemError";
import PolicyDetailsCard from "./PolicyDetailsCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

async function InternalPolicyCardsRenderer(_props: EngineeredJourneyProps) {
  try {
    const policyDetailsResponse = await getPolicyDetails();

    return (
      <>
        <DashboardSystemError errors={policyDetailsResponse.errors ?? []} />
        {policyDetailsResponse.data?.policyDetails.map((component: PolicyDetailsCardContent, index: number) => {
          return <PolicyDetailsCard key={index} data={component} />;
        })}
      </>
    );
  } catch (error) {
    logError(error, "InternalPolicyCardsRenderer", "Failed to fetch policy details");
  }
}

export default function PolicyCardsRenderer(props: EngineeredJourneyProps) {
  return (
    <Suspense fallback={<ProductCardSkeleton />}>
      <InternalPolicyCardsRenderer {...props} />
    </Suspense>
  );
}
