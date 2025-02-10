import { landingPageQuery } from './landingPageQuery';
import { standardErrorPageQuery } from './standardErrorPageQuery';

export const slugPageQuery = (slug: string) => ` query{
  ${landingPageQuery(slug)}
  ${standardErrorPageQuery(slug)}
}
  `;
