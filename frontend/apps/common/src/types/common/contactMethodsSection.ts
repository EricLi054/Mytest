export type ContentfulContactMethodsSection = {
  data: {
    rac_contactMethods: ContactMethodsSection;
  };
};

export type ContactMethodsSection = {
  heading: string;
  rendering: string;
  contactNumbersCollection: ContactNumbersCollection;
};

export type ContactNumbersCollection = {
  items: ContactNumbers[];
};

export type ContactNumbers = {
  businessAreaCovered: string;
  phoneNumber: string;
  openingHours: string;
  additionalOpeningHours: string;
};
