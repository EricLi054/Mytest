import { render, screen } from '@testing-library/react';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import EngineeredMembershipPage from './EngineeredMembershipPage';
import { EngineeredContentCollection } from '@/types/EngineeredJourneyProps';
import { testHelper } from '@/__tests__/helpers/testHelpers';
import { type ContentfulRichTextRendererProps } from '@/types/cmsTypes/ContentfulRichTextRendererProps';
import { BLOCKS } from '@contentful/rich-text-types';
import { type DigitalCardDetails } from '@/types/backendTypes/digitalCardDetails';

library.add(fas);

// Mocking ComponentSwitcher since we are not testing the engineered content part of the page
jest.mock('../../components/ServerComponents/ComponentSwitcher', () => {
  const ComponentSwitcher = (props: { component: any }) => <div>{props.component.__typename}</div>;
  return ComponentSwitcher;
});

jest.mock('../../utilities/analyticsTagging', () => ({
  logEvent: jest.fn()
}));

const mockPerson: PersonInformation = {
  racId: '12345678',
  cardColour: 'Blue',
  tier: 'Blue',
  membershipCardNumber: '123457890123456'
};

const mockPersonWithIgnite: PersonInformation = {
  ...mockPerson,
  tier: 'RAC Ignite'
};

const mockActiveDigitalCard: DigitalCardDetails = {
  isSuccess: true,
  value: {
    digitalCardPassIsActive: true,
    digitalCardPassId: 'testing-123',
    digitalCardPassUrl: 'https://www.example.com',
    numberOfPassesInstalled: 0
  }
};

const requestPhysicalCard: ContentfulRichTextRendererProps = {
  text: {
    json: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Request Physical Card Element',
              marks: [],
              data: {}
            }
          ]
        }
      ]
    }
  }
};

const mockedContent = new EngineeredContentCollection({
  contentId: 'membership-request-card-link',
  richTextContent: requestPhysicalCard.text
});

describe('EngineeredMembershipPage', () => {
  it('renders the page with correct member details', async () => {
    render(<EngineeredMembershipPage person={mockPerson} engineeredContent={mockedContent} />);

    expect(screen.getByText('Your membership')).toBeVisible();
    expect(screen.getByText('12345678')).toBeVisible();
    expect(screen.getByText('Tier')).toBeVisible();
    expect(screen.getByText('Blue member')).toBeVisible();
    expect(screen.getByTestId('digital-card-icon')).toBeVisible();
    expect(screen.queryByText('Request Physical Card Element')).toBeVisible();
  });

  it('digital card icon logs to GA when clicked', async () => {
    render(<EngineeredMembershipPage person={mockPerson} engineeredContent={new EngineeredContentCollection()} />);
    await testHelper.clickTestId('digital-card-icon', screen);

    testHelper.verifyEventLogged('Digital card icon click');
  });

  it('hide request-plastic-card-link when member tier is ignite and digitalCardPassIsActive is not defined', async () => {
    render(<EngineeredMembershipPage person={mockPersonWithIgnite} engineeredContent={mockedContent} />);

    expect(screen.queryByText('Request Physical Card Element')).toBeNull();
  });

  it('hide request-plastic-card-link when member tier is ignite and digitalCardPassIsActive is `true`', async () => {
    render(
      <EngineeredMembershipPage
        person={mockPersonWithIgnite}
        engineeredContent={mockedContent}
        digitalCardDetails={mockActiveDigitalCard}
      />
    );

    expect(screen.queryByText('Request Physical Card Element')).toBeNull();
  });
});
