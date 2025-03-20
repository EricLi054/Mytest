import { redirect } from "next/navigation";
import { serverEnv } from "#env/server";
import PersonBuilder from "#testing/builders/PersonBuilder";
import SessionBuilder from "#testing/builders/SessionBuilder";
import { getRegistrationErrorPageUrl } from "#utils/routing";
import { getRegistrationSession } from "#utils/session";
import { describe, expect, it, vi } from "vitest";

import { getDecodedNextAuthToken } from "@racwa/auth";
import { execute } from "@racwa/gql";

import { linkMemberAction } from "./actions";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation");
vi.mock("@racwa/auth");
vi.mock("#utils/session");
vi.mock("#utils/tempRacGraphClient");
vi.mock("@racwa/gql", () => ({
  execute: vi.fn(),
}));

const { MY_RAC_HOMEPAGE_URL } = serverEnv();

const successLinkResponse = {
  data: {
    updateAdAccountCrmId: {
      isSuccessful: true,
    },
  },
};

describe("linkMemberAction", () => {
  it("should link the member and redirect to myRAC", async () => {
    const person = new PersonBuilder().withPersonId("aaa-bbb-ccc").build();
    const session = new SessionBuilder().withPerson(person).build();
    vi.mocked(getDecodedNextAuthToken).mockReturnValue({ sub: "123-456-789" });
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve(successLinkResponse));

    vi.mocked(getRegistrationSession).mockResolvedValue(session);

    await linkMemberAction();

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(MY_RAC_HOMEPAGE_URL);
  });

  it("should use a custom redirect if provided", async () => {
    const redirectUrl = "www.google.com";
    const person = new PersonBuilder().withPersonId("aaa-bbb-ccc").build();
    const session = new SessionBuilder().withPerson(person).withRedirectUrl(redirectUrl).build();

    vi.mocked(getDecodedNextAuthToken).mockReturnValue({ sub: "123-456-789" });
    vi.mocked(execute).mockReturnValueOnce(Promise.resolve(successLinkResponse));
    vi.mocked(getRegistrationSession).mockResolvedValue(session);

    await linkMemberAction();

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(redirectUrl);
  });

  it("should error if CRM ID is missing", async () => {
    vi.mocked(getDecodedNextAuthToken).mockReturnValue({ sub: "123-456-789" });
    vi.mocked(getRegistrationSession).mockResolvedValue(
      new SessionBuilder().withPerson(new PersonBuilder().withPersonId("").build()).build(),
    );

    await linkMemberAction();

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
  });

  it("should error if Object ID is missing", async () => {
    vi.mocked(getDecodedNextAuthToken).mockReturnValue({ sub: "" });
    vi.mocked(getRegistrationSession).mockResolvedValue(
      new SessionBuilder().withPerson(new PersonBuilder().withPersonId("aaa-bbb-ccc").build()).build(),
    );

    await linkMemberAction();

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
  });

  it("should error if linking fails", async () => {
    vi.mocked(getDecodedNextAuthToken).mockReturnValue({ sub: "123-456-789" });
    vi.mocked(execute).mockReturnValueOnce(
      Promise.resolve({
        data: {
          updateAdAccountCrmId: {
            isSuccessful: false,
          },
        },
      }),
    );
    vi.mocked(getRegistrationSession).mockResolvedValue(
      new SessionBuilder().withPerson(new PersonBuilder().withPersonId("aaa-bbb-ccc").build()).build(),
    );

    await linkMemberAction();

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith(getRegistrationErrorPageUrl({ page: "/system-unavailable" }));
  });
});
