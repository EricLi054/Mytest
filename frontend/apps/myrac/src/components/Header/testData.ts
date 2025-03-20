import type { PersonSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";

import type { RawHeaderSchema } from "./schema";

export const testHeaderSchema: z.infer<typeof RawHeaderSchema> = {
  showBreadcrumbs: false,
  links: {
    items: [
      { longLinkText: "Link 1", shortLinkText: "1", linkUrl: "/link1", googleAnalyticsDescription: "Link 1" },
      { longLinkText: "Link 2", shortLinkText: "2", linkUrl: "/link2", googleAnalyticsDescription: "Link 2" },
      { longLinkText: "Link 3", shortLinkText: "3", linkUrl: "/link3", googleAnalyticsDescription: "Link 3" },
    ],
  },
  mobileLinks: {
    items: [
      { longLinkText: "Link 1", shortLinkText: "1", linkUrl: "/link1", googleAnalyticsDescription: "Link 1" },
      { longLinkText: "Link 2", shortLinkText: "2", linkUrl: "/link2", googleAnalyticsDescription: "Link 2" },
      { longLinkText: "Link 3", shortLinkText: "3", linkUrl: "/link3", googleAnalyticsDescription: "Link 3" },
    ],
  },
  searchBar: {
    placeholderText: "Search",
  },
  userMenu: {
    menuItems: {
      items: [
        {
          longLinkText: "User menu Link 1",
          shortLinkText: "1",
          linkUrl: "/link1",
          googleAnalyticsDescription: "User menu Link 1",
        },
        {
          longLinkText: "User menu Link 2",
          shortLinkText: "2",
          linkUrl: "/link2",
          googleAnalyticsDescription: "User menu Link 2",
        },
        {
          longLinkText: "User menu Link 3",
          shortLinkText: "3",
          linkUrl: "/link3",
          googleAnalyticsDescription: "User menu Link 3",
        },
      ],
    },
  },
};

export const testPerson: z.infer<typeof PersonSchema> = {
  racId: "1234",
  title: "Mr",
  firstName: "Joe",
  surname: "Bloggs",
  membershipCardNumber: "Member",
  membershipType: "Member",
  tier: "Blue",
  cardColour: "Blue",
};
