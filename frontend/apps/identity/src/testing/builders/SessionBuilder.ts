import type { Person } from "#app/register/(register)/match/types/index";
import type { RegistrationSession } from "#utils/session";

import { createMfaSessionKey } from "@racwa/mfa";

export default class SessionBuilder {
  session: RegistrationSession;

  constructor() {
    // Initialise with an empty session
    this.session = {
      id: undefined,
      mfaSessionKey: undefined,
      redirectUrl: undefined,
      person: undefined,
      incorrectMatchAttempts: 0,
      steps: {
        beforeYouStart: undefined,
        match: undefined,
      },
    };
  }

  build(): RegistrationSession {
    return this.session;
  }

  withSessionId(sessionId: string | undefined): SessionBuilder {
    this.session.id = sessionId;
    if (sessionId) {
      this.session.mfaSessionKey = createMfaSessionKey("my-rac-account-registration", sessionId);
    }
    return this;
  }

  withRedirectUrl(redirectUrl: string | undefined): SessionBuilder {
    this.session.redirectUrl = redirectUrl;
    return this;
  }

  withPerson(person: Person | undefined): SessionBuilder {
    this.session.person = person;
    return this;
  }

  withIncorrectMatchAttempts(attempts: number): SessionBuilder {
    this.session.incorrectMatchAttempts = attempts;
    return this;
  }
}
