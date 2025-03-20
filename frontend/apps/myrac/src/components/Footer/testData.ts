import type { ContentfulButtonSchema } from "#graphql/sharedSchema/buttonSchema";
import type { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import type { z } from "zod";
import { BLOCKS } from "@contentful/rich-text-types";

import type { SiteMapData } from "@racwa/react-components";

import type { RawFooterSchema } from "./schema";

export const sitemapData: SiteMapData[] = [
  {
    title: "About RAC",
    link: "#",
    children: [
      {
        title: "Advocating change",
        link: "#",
      },
      {
        title: "In the community",
        link: "#",
      },
      {
        title: "Help centre",
        link: "#",
      },
      {
        title: "Frequently asked questions",
        link: "#",
      },
      {
        title: "Contact us",
        link: "#",
      },
      {
        title: "Find a branch",
        link: "#",
      },
      {
        title: "Careers",
        link: "#",
      },
      {
        title: "Media",
        link: "#",
      },
    ],
  },
  {
    title: "RAC Products & Services",
    link: "#",
    children: [
      {
        title: "Pay or Renew",
        link: "#",
      },
      {
        title: "Insurance",
        link: "#",
      },
      {
        title: "Claims",
        link: "#",
      },
      {
        title: "Roadside Assistance",
        link: "#",
      },
      {
        title: "Travel",
        link: "#",
      },
      {
        title: "Holiday Parks and Resorts",
        link: "#",
      },
      {
        title: "Finance",
        link: "#",
      },
      {
        title: "Home Security",
        link: "#",
      },
      {
        title: "Car servicing & repair",
        link: "#",
      },
      {
        title: "Home Services",
        link: "#",
      },
    ],
  },
  {
    title: "Information & advice",
    link: "#",
    children: [
      {
        title: "Car & Motoring",
        link: "#",
      },
      {
        title: "Home & Life",
        link: "#",
      },
      {
        title: "Travel & Touring",
        link: "#",
      },
      {
        title: "Membership & Benefits",
        link: "#",
      },
    ],
  },
];

export const footerLinks: z.infer<z.ZodArray<typeof ContentfulLinkSchema>> = [
  {
    longLinkText: "Privacy",
    shortLinkText: "Privacy",
    linkUrl: "/privacy",
  },
  {
    longLinkText: "Disclaimer",
    shortLinkText: "Disclaimer",
    linkUrl: "/disclaimer",
  },
  {
    longLinkText: "Security",
    shortLinkText: "Security",
    linkUrl: "/security",
  },
  {
    longLinkText: "Accessibility",
    shortLinkText: "Accessibility",
    linkUrl: "/accessibility",
  },
  {
    longLinkText: "Covid-19",
    shortLinkText: "Covid-19",
    linkUrl: "/covid",
  },
];

export const footerSocialLinks: z.infer<z.ZodArray<typeof ContentfulButtonSchema>> = [
  {
    longText: "RAC on Instagram",
    link: "/instagram",
    icon: "instagram",
    logoHoverColour: "#3f729b",
    variant: "Social Icon",
  },
  {
    longText: "RAC on Facebook",
    link: "/facebook",
    icon: "facebook-square",
    logoHoverColour: "#3b5998",
    variant: "Social Icon",
  },
  {
    longText: "RAC on Twitter",
    link: "/twitter",
    icon: "twitter",
    logoHoverColour: "#55acee",
    variant: "Social Icon",
  },
  {
    longText: "RAC on LinkedIn",
    link: "/linkedin",
    icon: "linkedin-in",
    logoHoverColour: "#0e76a8",
    variant: "Social Icon",
  },
];

export const footerContentfulData: z.infer<typeof RawFooterSchema> = {
  logo: [{ secureUrl: "test" }],
  searchBar: {
    placeholderText: "Search",
  },
  sitemap: {
    items: sitemapData.map((data) => {
      return {
        parentLink: {
          longLinkText: data.title,
          shortLinkText: "",
          linkUrl: data.link,
        },
        links: {
          // @ts-expect-error we know children is not undefined here
          items: data.children.map((childLink) => {
            return {
              longLinkText: childLink.title,
              shortLinkText: "",
              linkUrl: childLink.link,
            };
          }),
        },
      };
    }),
  },
  links: {
    items: footerLinks,
  },
  socialLinks: {
    items: footerSocialLinks,
  },
  endText: {
    json: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: "text",
              value: "Footer text",
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
  },
};
