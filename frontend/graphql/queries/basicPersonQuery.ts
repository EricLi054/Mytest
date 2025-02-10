export const basicPersonQuery = () => `
{
  person(sessionKey: "") {
    firstName
    membershipType
  }
}`;
