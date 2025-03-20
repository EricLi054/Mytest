type Credentials = {
  username: string;
  password: string;
};

export type UserType = 'DEFAULT_USER' | 'LANDLINE_ONLY_USER' | 'NO_PHONE_USER';
export type MemberType = keyof typeof memberCredentials;
export type SpecialUserType = keyof typeof specialCredentials;
export type TestUserType = keyof typeof testCredentials;

const getCurrentEnv = () => (process.env.PLAYWRIGHT_ENV?.toUpperCase() || 'SIT') as 'SIT' | 'UAT';

export const memberCredentials = {
  blue: {
    username: process.env.PLAYWRIGHT_BLUE_MEMBER || '',
    password: process.env.PLAYWRIGHT_BLUE_PASSWORD || ''
  },
  red: {
    username: process.env.PLAYWRIGHT_RED_MEMBER || '',
    password: process.env.PLAYWRIGHT_RED_PASSWORD || ''
  },
  bronze: {
    username: process.env.PLAYWRIGHT_BRONZE_MEMBER || '',
    password: process.env.PLAYWRIGHT_BRONZE_PASSWORD || ''
  },
  silver: {
    username: process.env.PLAYWRIGHT_SILVER_MEMBER || '',
    password: process.env.PLAYWRIGHT_SILVER_PASSWORD || ''
  },
  gold: {
    username: process.env.PLAYWRIGHT_GOLD_MEMBER || '',
    password: process.env.PLAYWRIGHT_GOLD_PASSWORD || ''
  },
  goldLife: {
    username: process.env.PLAYWRIGHT_GOLD_LIFE_MEMBER || '',
    password: process.env.PLAYWRIGHT_GOLD_LIFE_PASSWORD || ''
  },
  staff: {
    username: process.env.PLAYWRIGHT_STAFF_MEMBER || '',
    password: process.env.PLAYWRIGHT_STAFF_PASSWORD || ''
  },
  free2go: {
    username: process.env.PLAYWRIGHT_FREE2GO_MEMBER || '',
    password: process.env.PLAYWRIGHT_FREE2GO_PASSWORD || ''
  },
  ignite: {
    username: process.env.PLAYWRIGHT_IGNITE_MEMBER || '',
    password: process.env.PLAYWRIGHT_IGNITE_PASSWORD || ''
  },
  DEFAULT_USER: {
    username:
      getCurrentEnv() === 'SIT' ? process.env.PLAYWRIGHT_SIT_USERNAME || '' : process.env.PLAYWRIGHT_UAT_USERNAME || '',
    password:
      getCurrentEnv() === 'SIT' ? process.env.PLAYWRIGHT_SIT_PASSWORD || '' : process.env.PLAYWRIGHT_UAT_PASSWORD || ''
  }
} as const;

export const specialCredentials = {
  digitalCard: {
    username:
      getCurrentEnv() === 'SIT' ? process.env.PLAYWRIGHT_SIT_USERNAME || '' : process.env.PLAYWRIGHT_UAT_USERNAME || '',
    password:
      getCurrentEnv() === 'SIT' ? process.env.PLAYWRIGHT_SIT_PASSWORD || '' : process.env.PLAYWRIGHT_UAT_PASSWORD || ''
  },
  activeDigitalCard: {
    username: process.env.ACTIVE_DIGITAL_CARD_MEMBER || '',
    password: process.env.ACTIVE_DIGITAL_CARD_PASSWORD || ''
  },
  cardUAT: {
    username: process.env.CARD_USER_UAT || '',
    password: process.env.CARD_PASSWORD_UAT || ''
  }
} as const;

export const testCredentials = {
  default: {
    username:
      getCurrentEnv() === 'SIT' ? process.env.PLAYWRIGHT_SIT_USERNAME || '' : process.env.PLAYWRIGHT_UAT_USERNAME || '',
    password:
      getCurrentEnv() === 'SIT' ? process.env.PLAYWRIGHT_SIT_PASSWORD || '' : process.env.PLAYWRIGHT_UAT_PASSWORD || ''
  },
  finLoan: {
    username: process.env.PLAYWRIGHT_FIN_LOAN_MEMBER || '',
    password: process.env.PLAYWRIGHT_FIN_LOAN_PASSWORD || ''
  },
  crmIdNotFound: {
    username: process.env.PLAYWRIGHT_CRMID_NOTFOUND || '',
    password: process.env.PLAYWRIGHT_CRMID_NOTFOUND_PASSWORD || ''
  },
  landlineOnly: {
    username: process.env.PLAYWRIGHT_LANDLINE_USER || '',
    password: process.env.PLAYWRIGHT_LANDLINE_PASSWORD || ''
  },
  noPhone: {
    username: process.env.PLAYWRIGHT_NO_PHONE_USER || '',
    password: process.env.PLAYWRIGHT_NO_PHONE_PASSWORD || ''
  }
} as const;

export function getCredentials(userType: UserType): Credentials {
  const credentialMap: Record<UserType, Credentials> = {
    DEFAULT_USER: {
      username:
        getCurrentEnv() === 'SIT'
          ? process.env.PLAYWRIGHT_SIT_USERNAME || ''
          : process.env.PLAYWRIGHT_UAT_USERNAME || '',
      password:
        getCurrentEnv() === 'SIT'
          ? process.env.PLAYWRIGHT_SIT_PASSWORD || ''
          : process.env.PLAYWRIGHT_UAT_PASSWORD || ''
    },
    LANDLINE_ONLY_USER: testCredentials.landlineOnly,
    NO_PHONE_USER: testCredentials.noPhone
  };

  return credentialMap[userType];
}
