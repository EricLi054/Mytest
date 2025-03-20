import { render, screen } from "@testing-library/react";
import { clientEnv } from "#env/client";
import { testHelper } from "#utils/testHelper";
import { signIn, signOut, useSession } from "next-auth/react";
import { describe, expect, it, vi } from "vitest";

import LoginButton from ".";
import { getMenuLinks, getTitleLink } from "./util";

testHelper.mockEnvironmentVariableProvider();
vi.mock("server-only", () => ({}));

vi.mock("#utils/analyticsTagging", () => ({
  logNavClick: vi.fn(),
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => {
    return {
      push: pushMock,
    };
  },
}));
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    delete: vi.fn(),
  })),
}));

const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: { email: "test-email@test.com" },
};

const mockUserMenu = [
  {
    longLinkText: "Title",
    shortLinkText: "Title",
    linkUrl: "/",
    googleAnalyticsDescription: "Title GA event",
  },
  {
    longLinkText: "Link 1",
    shortLinkText: "Link 1",
    linkUrl: "/1",
    googleAnalyticsDescription: "Link 1 GA event",
  },
  {
    longLinkText: "Link 2",
    shortLinkText: "Link 2",
    linkUrl: "/2",
    googleAnalyticsDescription: "Link 2 GA event",
  },
];

describe("LoginButton", () => {
  it("should get the title link from a list of links", () => {
    const result = getTitleLink(mockUserMenu);

    expect(result?.props).toHaveProperty("href", "/");
  });

  it("should get the menu links from a list of links", () => {
    const result = getMenuLinks(mockUserMenu, clientEnv());

    expect(result.length).toEqual(2);
    expect(result[0]?.key).toEqual("/1");
    expect(result[1]?.key).toEqual("/2");
  });

  it("should render the login button unauthenticated", async () => {
    vi.mocked(useSession).mockReturnValue({ data: null, status: "unauthenticated", update: vi.fn() });
    render(<LoginButton memberFirstName="Name" userMenu={mockUserMenu} />);

    await testHelper.clickButton("Log in or register", screen);

    expect(vi.mocked(signIn)).toHaveBeenCalled();
  });

  it("should render the login button authenticated", async () => {
    vi.mocked(useSession).mockReturnValue({ data: mockSession, status: "authenticated", update: vi.fn() });
    render(<LoginButton memberFirstName="Name" userMenu={mockUserMenu} />);

    await testHelper.clickText("Name", screen);

    const title = screen.getByText("Title");
    const link1 = screen.getByText("Link 1");
    const link2 = screen.getByText("Link 2");

    expect(title).toHaveAttribute("href", "/");
    expect(link1).toHaveAttribute("href", "/1");
    expect(link2).toHaveAttribute("href", "/2");

    await testHelper.clickButton("Log out", screen);

    expect(vi.mocked(signOut)).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalled();
  });

  // eslint-disable-next-line vitest/expect-expect
  it("should trigger GA navClick event when click on title link when authenticated", async () => {
    vi.mocked(useSession).mockReturnValue({ data: mockSession, status: "authenticated", update: vi.fn() });
    render(<LoginButton memberFirstName="Name" userMenu={mockUserMenu} />);

    await testHelper.clickText("Name", screen);

    testHelper.verifyNavClickLogged("myRAC - First name dropdown");

    await testHelper.clickLink("Title", screen);

    testHelper.verifyNavClickLogged("Title GA event");
  });

  // eslint-disable-next-line vitest/expect-expect
  it("should trigger GA navClick event when click when authenticated", async () => {
    vi.mocked(useSession).mockReturnValue({ data: mockSession, status: "authenticated", update: vi.fn() });
    render(<LoginButton memberFirstName="Name" userMenu={mockUserMenu} />);

    await testHelper.clickText("Name", screen);

    testHelper.verifyNavClickLogged("myRAC - First name dropdown");

    await testHelper.clickLink("Link 1", screen);

    testHelper.verifyNavClickLogged("Link 1 GA event");
  });
});
