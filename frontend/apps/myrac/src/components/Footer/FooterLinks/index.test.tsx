import type { ContentfulButtonSchema } from "#graphql/sharedSchema/buttonSchema";
import type { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import type { z } from "zod";
import { faFacebookSquare, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { describe, expect, it } from "vitest";

import { generateFooterLinks, generateSocialLinks } from "./util";

describe("FooterLinks", () => {
  it("should generate footer links", () => {
    const mockLinks: z.infer<z.ZodArray<typeof ContentfulLinkSchema>> = [
      {
        longLinkText: "Link 1",
        shortLinkText: "Link 1",
        linkUrl: "/link1",
      },
      {
        longLinkText: "Link 2",
        shortLinkText: "Link 2",
        linkUrl: "/link2",
      },
    ];
    const expectedOutput = [
      {
        label: "Link 1",
        link: "/link1",
      },
      {
        label: "Link 2",
        link: "/link2",
      },
    ];
    const result = generateFooterLinks(mockLinks);

    expect(result).toEqual(expectedOutput);
  });

  it("should generate footer social links", () => {
    const mockLinks: z.infer<z.ZodArray<typeof ContentfulButtonSchema>> = [
      {
        longText: "Link 1",
        link: "/link1",
        icon: "instagram",
        logoHoverColour: "#fff",
        variant: "Social Icon",
      },
      {
        longText: "Link 2",
        link: "/link2",
        icon: "facebook-square",
        logoHoverColour: "#fff",
        variant: "Social Icon",
      },
    ];
    const expectedOutput = [
      {
        title: "Link 1",
        link: "/link1",
        logo: faInstagram,
        logoHoverColor: "#fff",
      },
      {
        title: "Link 2",
        link: "/link2",
        logo: faFacebookSquare,
        logoHoverColor: "#fff",
      },
    ];
    const result = generateSocialLinks(mockLinks);

    expect(result).toEqual(expectedOutput);
  });
});
