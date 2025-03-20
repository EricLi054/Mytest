import type { RichTextSchema } from "#graphql/sharedSchema/richTextSchema";
import type { z } from "zod";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { ModalProvider } from "#providers/modal";
import { EngineeredContentCollection } from "#types/EngineeredJourneyProps";

import MembershipPage from ".";

export default {
  title: "MyRAC/Components/Membership Page",
  component: MembershipPage,
  tags: ["@racwa/myrac"],
};

const title: z.infer<typeof RichTextSchema> = {
  json: {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.HEADING_2,
        data: {},
        content: [
          {
            nodeType: "text",
            value: "Membership",
            marks: [],
            data: {},
          },
        ],
      },
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          { nodeType: "text", value: "", marks: [], data: {} },
          {
            // Storybook cannot call backend graphql to fetch the contentful
            // data, changing nodeType to normal hyperlink to render it.
            nodeType: INLINES.HYPERLINK,
            data: {
              uri: "https://rac.com.au",
            },
            content: [
              {
                nodeType: "text",
                value: "< Profile",
                marks: [],
                data: {},
              },
            ],
          },
          { nodeType: "text", value: "", marks: [], data: {} },
        ],
      },
    ],
  },
};

const requestCardLink: z.infer<typeof RichTextSchema> = {
  json: {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          { nodeType: "text", value: "", marks: [], data: {} },
          {
            // Storybook cannot call backend graphql to fetch the contentful
            // data, changing nodeType to normal hyperlink to render it.
            nodeType: INLINES.HYPERLINK,
            data: {
              uri: "https://rac.com.au",
            },
            content: [
              {
                nodeType: "text",
                value: "Request a plastic card",
                marks: [],
                data: {},
              },
            ],
          },
          { nodeType: "text", value: "", marks: [], data: {} },
        ],
      },
    ],
  },
};

const engineeredContent = new EngineeredContentCollection(
  { contentId: "membership-title", richTextContent: title },
  { contentId: "membership-request-card-link", richTextContent: requestCardLink },
);

export const MembershipPageDetails = () => {
  return (
    <MembershipPage
      person={{
        racId: "12345678",
        title: "Mr",
        firstName: "John",
        surname: "Doe",
        membershipType: "Classic",
        cardColour: "Gold",
        tier: "Gold",
        membershipCardNumber: "1234567890123456",
      }}
      engineeredContent={engineeredContent}
    />
  );
};

export const MembershipPageDetailsWithDigitalCard = () => {
  return (
    <ModalProvider>
      <MembershipPage
        person={{
          racId: "12345678",
          title: "Mr",
          firstName: "Test",
          surname: "Tester",
          membershipType: "Classic",
          cardColour: "Gold",
          tier: "Gold",
          membershipCardNumber: "1234567890123456",
          digitalCardDetails: {
            id: "id-123",
            isActive: true,
            passId: "12345",
            passUrl: "https://digital-card-link",
            numberOfPassesInstalled: 0,
          },
        }}
        engineeredContent={engineeredContent}
      />
    </ModalProvider>
  );
};
