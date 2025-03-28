import type { Person } from "#app/register/(register)/match/types/index";

export default class PersonBuilder {
  person: Person;

  constructor() {
    this.person = {
      personId: "abc-123-xyz",
      racId: "0123456",
      firstName: "Anurag",
      mobilePhone: "0412345678",
      membershipType: "Member",
    };
  }

  build(): Person {
    return this.person;
  }

  withPersonId(personId: string): PersonBuilder {
    this.person.personId = personId;
    return this;
  }

  withMembershipType(membershipType: string): PersonBuilder {
    this.person.membershipType = membershipType;
    return this;
  }
}
