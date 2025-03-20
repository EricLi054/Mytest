type ArrayElement<T extends readonly unknown[]> = T[number];

const getRandomValue = <T extends readonly unknown[]>(array: T, exclude?: ArrayElement<T>): ArrayElement<T> => {
  const values = exclude ? [...array].filter((item) => item !== exclude) : array;
  return values[Math.floor(Math.random() * values.length)];
};

const TITLES = ['Mr', 'Mrs', 'Miss', 'Ms', 'Mx', 'Dr'] as const;
const FIRST_NAMES = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily'] as const;
const MIDDLE_NAMES = ['Lee', 'Marie', 'James', 'Ann', 'Ray', 'Lynn'] as const;
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'] as const;
const MOBILE_NUMBERS = ['0400123456', '0412345678', '0423456789', '0434567890', '0445678901', '0456789012'] as const;
const HOME_PHONES = ['0812345678', '0823456789', '0834567890', '0845678901', '0856789012', '0867890123'] as const;
const WORK_PHONES = ['0897100000', '0897200000', '0897300000', '0400123456', '0412345678', '0423456789'] as const;
const EMAIL_ADDRESSES = [
  'volume-am@xxofceaa.mailosaur.net',
  'tear-duct@xxofceaa.mailosaur.net',
  'supper-time@xxofceaa.mailosaur.net',
  'batman-robbin@xxofceaa.mailosaur.net',
  'swimming-lane@xxofceaa.mailosaur.net',
  'brave-soul@xxofceaa.mailosaur.net'
] as const;

export const generateRandom = {
  title: (current?: string) => getRandomValue(TITLES, current as ArrayElement<typeof TITLES>),
  firstName: (current?: string) => getRandomValue(FIRST_NAMES, current as ArrayElement<typeof FIRST_NAMES>),
  middleName: (current?: string) => getRandomValue(MIDDLE_NAMES, current as ArrayElement<typeof MIDDLE_NAMES>),
  lastName: (current?: string) => getRandomValue(LAST_NAMES, current as ArrayElement<typeof LAST_NAMES>),
  mobileNumber: (current?: string) => getRandomValue(MOBILE_NUMBERS, current as ArrayElement<typeof MOBILE_NUMBERS>),
  homePhone: (current?: string) => getRandomValue(HOME_PHONES, current as ArrayElement<typeof HOME_PHONES>),
  workPhone: (current?: string) => getRandomValue(WORK_PHONES, current as ArrayElement<typeof WORK_PHONES>),
  email: (current?: string) => getRandomValue(EMAIL_ADDRESSES, current as ArrayElement<typeof EMAIL_ADDRESSES>)
};
