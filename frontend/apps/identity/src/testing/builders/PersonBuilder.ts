import type { OtpVerificationDetails, Person } from "#app/register/(register)/match/types/index";

export default class PersonBuilder {
  person: Person;

  constructor() {
    this.person = {
      personId: "abc-123-xyz",
      racId: "0123456",
      firstName: "Anurag",
      mobilePhone: "0412345678",
      membershipType: "Member",
      otpVerificationDetails: {
        sessionKey: "my-rac-account-registration-1234356789-987654321",
        isAuthenticated: false,
        isMobile: true,
        phoneNumberSuffix: "678",
      },
    };
  }

  build(): Person {
    return this.person;
  }

  withPersonId(personId: string): PersonBuilder {
    this.person.personId = personId;
    return this;
  }

  withOtpVerificationDetails(otpVerificationDetails: OtpVerificationDetails | undefined): PersonBuilder {
    this.person.otpVerificationDetails = otpVerificationDetails ?? null;
    return this;
  }
}
