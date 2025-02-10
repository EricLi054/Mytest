'use server';

import getData from './getData';
import { type FeatureToggle } from '@/types/backendTypes/featureToggle';

async function getFeatureToggles(): Promise<FeatureToggle[]> {
  const data = await getData(
    `
      query {
        featureToggles {
            key
            enabled
        }
      }
    `
  );

  return data?.featureToggles ?? [];
}

export default getFeatureToggles;
