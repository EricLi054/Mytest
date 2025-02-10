import type { ComponentSwitchableProps } from '@/types/ComponentSwitchableProps';
import { getComponent } from '@/graphql/getComponent';
import CardRequestForm from '../ClientComponents/CardRequestForm';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import MemberDetailsBar from './MemberDetailsBar';
import getPerson from '@/graphql/getPerson';
import getUnmaskedAddress from '@/graphql/getUnmaskedAddress';
import { type PersonAddress } from '@/types/backendTypes/personAddress';
import CardRequestSuccessPage from './CardRequestSuccessPage';
import { EngineeredContentCollection, type EngineeredJourneyProps } from '@/types/EngineeredJourneyProps';
import { getAccessToken } from '@/utilities/getAccessToken';
import getDigitalCardDetails from '@/graphql/getDigitalCardDetails';
import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';
import EngineeredMembershipPage from './EngineeredMembershipPage';
import PolicyCardsRenderer from './PolicyCardsRenderer';

const fields = `
  __typename
  placeholderType
  engineeredContentCollection {
    items {
      contentId
      stringContent
      iconContent
      richTextContent {
        json
        links {
          entries {
            inline {
              __typename
              sys {
                id
              }
            }
          }
        }
      }
      imageContent: cloudinaryContent
    }
  }
`;

const requiresPersonData = ['Membership', 'Member Details Bar'];
const requiresUnmaskedAddressData = ['CardRequestForm'];
const requiresDigitalCardData = ['Member Details Bar', 'Membership', 'CardRequestSuccess'];

const placeholderTypeMap: Record<string, React.FC<EngineeredJourneyProps>> = {
  Membership: EngineeredMembershipPage,
  CardRequestForm,
  CardRequestSuccess: CardRequestSuccessPage,
  'Member Details Bar': MemberDetailsBar,
  'Policy Cards': PolicyCardsRenderer
};

async function Placeholder({ data }: ComponentSwitchableProps) {
  const token = await getAccessToken();
  const component = await getComponent('placeholder', data.sys.id, fields, true, token);
  const Component = placeholderTypeMap[component?.placeholderType as string];

  if (!Component) {
    console.error('Error: PlaceHolder.tsx Component not found for placeholderType: ', component?.placeholderType);
    return undefined;
  }

  const person: PersonInformation | undefined = requiresPersonData.includes(component.placeholderType)
    ? (await getPerson())?.person
    : undefined;

  const unmaskedAddress: PersonAddress | undefined = requiresUnmaskedAddressData.includes(component.placeholderType)
    ? await getUnmaskedAddress()
    : undefined;

  const digitalCardDetails: DigitalCardDetails | undefined = requiresDigitalCardData.includes(component.placeholderType)
    ? await getDigitalCardDetails()
    : undefined;

  return (
    <Component
      person={person}
      unmaskedAddress={unmaskedAddress}
      digitalCardDetails={digitalCardDetails}
      engineeredContent={new EngineeredContentCollection(...component.engineeredContentCollection?.items)}
    />
  );
}

export default Placeholder;
