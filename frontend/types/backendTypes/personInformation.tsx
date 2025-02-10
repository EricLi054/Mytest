export const NON_MEMBER_TYPE = 'Non-Member';

export interface PersonInformation {
  racId?: string;
  membershipCardNumber?: string;
  tier?: string;
  cardColour?: string;
  membershipType?: string;
  title?: string;
  firstName?: string;
  middleName?: string;
  surname?: string;
  homePhone?: string;
  mobilePhone?: string;
  workPhone?: string;
  personalEmailAddress?: string;
  postalAddress?: { formattedAddress?: string };
}
