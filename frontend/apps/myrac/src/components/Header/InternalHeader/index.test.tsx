import { render, screen } from "@testing-library/react";
import { testHelper } from "#utils/testHelper";
import { useSession } from "next-auth/react";
import { describe, it, vi } from "vitest";

import InternalHeader from ".";
import { testHeaderSchema, testPerson } from "../testData";

testHelper.mockEnvironmentVariableProvider();

vi.mock("#utils/analyticsTagging", () => ({
  logNavClick: vi.fn(),
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: { email: "test-email@test.com" },
};

vi.mocked(useSession).mockReturnValue({
  data: mockSession,
  status: "authenticated",
  update: vi.fn(),
});

// TODO: Some more rendering tests would be good here
describe("Header", () => {
  // eslint-disable-next-line vitest/expect-expect
  it("should trigger GA navClick event when clicked", async () => {
    render(<InternalHeader headerData={testHeaderSchema} person={testPerson} />);

    await testHelper.clickButton("J", screen); // Button just has first letter of name
    testHelper.verifyNavClickLogged("Hamburger menu - Open");

    await testHelper.clickButton("J", screen);
    testHelper.verifyNavClickLogged("Hamburger menu - Close");

    await testHelper.clickButton("J", screen);

    const yellowCardImage = screen.getByRole("img", { name: "member-card-yellow" });
    await testHelper.clickElement(yellowCardImage);
    testHelper.verifyNavClickLogged("myRAC - Digital card icon");

    await testHelper.clickText("Joe Bloggs", screen);
    testHelper.verifyNavClickLogged("myRAC - Full name");

    await testHelper.clickLink("User menu Link 1", screen);
    testHelper.verifyNavClickLogged("User menu Link 1");
  });
});
