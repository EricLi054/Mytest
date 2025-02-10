import { getAccessToken } from '@/utilities/getAccessToken';
import ProductCardSkeleton from '../ClientComponents/ProductCardSkeleton';
import { Suspense } from 'react';
import policyDetailsQuery from '@/graphql/queries/policyDetailsQuery';
import { type EngineeredJourneyProps } from '@/types/EngineeredJourneyProps';
import PolicyDetailsCard from '../ClientComponents/PolicyDetailsCard';

async function InternalPolicyCardsRenderer(_props: EngineeredJourneyProps) {
  const token = await getAccessToken();

  try {
    const policyDetailsData = await policyDetailsQuery(token);

    return policyDetailsData.map((component: any, index: number) => {
      return <PolicyDetailsCard key={index} data={component} />;
    });
  } catch (error) {
    console.error('Error: InternalPolicyCardsRenderer.tsx -', error);
    // Handle the error here
  }
}

export default async function PolicyCardsRenderer(props: EngineeredJourneyProps) {
  return (
    <Suspense fallback={<ProductCardSkeleton />}>
      <InternalPolicyCardsRenderer {...props} />
    </Suspense>
  );
}
