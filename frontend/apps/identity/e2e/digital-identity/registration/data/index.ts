export type Member = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  identificationMethod: "mobile" | "membership" | "policy";
  identifier: string;
};

export const memberData: Member = {
  firstName: "Tracie",
  lastName: "Watts",
  dateOfBirth: "01/01/2000",
  identificationMethod: "mobile",
  identifier: "0412341234",
};

export const nonExistentMember: Member = {
  firstName: "Isaac",
  lastName: "Newton",
  dateOfBirth: "04/01/1643",
  identificationMethod: "membership",
  identifier: "99999",
};
