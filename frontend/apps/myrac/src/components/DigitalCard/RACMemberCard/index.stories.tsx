import type { Meta } from "@storybook/react";
import { ModalProvider } from "#providers/modal";

import type { RACMemberCardProps } from "./";
import RACMemberCard from "./";

export default {
  title: "MyRAC/Components/Digital Card/RAC Member Card",
  component: RACMemberCard,
  tags: ["@racwa/myrac"],
  decorators: [
    (Story) => (
      <ModalProvider>
        <Story />
      </ModalProvider>
    ),
  ],
} as Meta<typeof RACMemberCard>;

const getProps = (cardColour = "Gold"): RACMemberCardProps => ({
  person: {
    cardColour: cardColour,
    membershipCardNumber: "1231231231231231",
    title: "Mr",
    firstName: "John",
    surname: "Doe",
    tier: "Gold Life",
    racId: "12345678",
    membershipType: "Gold",
    digitalCardDetails: {
      id: "12345",
      passId: "12345",
      isActive: true,
      passUrl: "https://digital-card-link",
      numberOfPassesInstalled: 0,
    },
  },
});

const storageKey = "storybook-digital-card-promo-key";

export const Default = () => {
  return <RACMemberCard {...getProps("Blue")} />;
};

export const WithPromoMessagingLeftAligned = () => {
  localStorage.removeItem(storageKey); // force the promo message to show
  return (
    <div style={{ paddingTop: 100 }}>
      <RACMemberCard {...getProps()} storageKey={storageKey} />
    </div>
  );
};

export const WithPromoMessagingRightAligned = () => {
  localStorage.removeItem(storageKey); // force the promo message to show
  return (
    <div style={{ paddingTop: 100, display: "flex", justifyContent: "flex-end" }}>
      <RACMemberCard {...getProps()} storageKey={storageKey} />
    </div>
  );
};

export const WithSilverBackground = () => {
  return <RACMemberCard {...getProps("Silver")} />;
};

export const WithRedBackground = () => {
  return <RACMemberCard {...getProps("Red")} />;
};
