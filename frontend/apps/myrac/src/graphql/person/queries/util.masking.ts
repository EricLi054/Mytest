import type { z } from "zod";

import type { RawPersonSchema } from "./schema";

const MOBILE_NUMBER_LENGTH = 10;
const LANDLINE_NO_AREA_LENGTH = 8;
const LANDLINE_WITH_AREA_LENGTH = 10;

export const maskStringArray = (toMask: string[]) => {
  return toMask.map((entry) => {
    return entry.replace(/\S/g, "*");
  });
};

export const padMobileNumber = (mobileNumber?: string | null) => {
  if (!mobileNumber || mobileNumber.length !== MOBILE_NUMBER_LENGTH) {
    return mobileNumber;
  }

  return `${mobileNumber.substring(0, 4)} ${mobileNumber.substring(4, 7)} ${mobileNumber.substring(7)}`;
};

export const padLandline = (landline?: string | null) => {
  if (!landline) {
    return landline;
  }

  if (landline.length === LANDLINE_NO_AREA_LENGTH) {
    return `${landline.substring(0, 4)} ${landline.substring(4)}`;
  } else if (landline.length === LANDLINE_WITH_AREA_LENGTH) {
    return `${landline.substring(0, 2)} ${landline.substring(2, 6)} ${landline.substring(6)}`;
  } else {
    return landline;
  }
};

export const maskMobileNumber = (mobileNumber?: string | null) => {
  if (!mobileNumber) {
    return mobileNumber;
  }

  let maskedNumber = "*".repeat(10);
  if (mobileNumber.length === MOBILE_NUMBER_LENGTH) {
    maskedNumber = mobileNumber.substring(0, 2) + "*".repeat(5) + mobileNumber.substring(7);
  }

  return padMobileNumber(maskedNumber);
};

export const maskLandline = (landline?: string | null) => {
  if (!landline) {
    return landline;
  }

  let maskedNumber = "*".repeat(8);
  if (landline.length === LANDLINE_WITH_AREA_LENGTH) {
    maskedNumber = landline.substring(0, 2) + "*".repeat(5) + landline.substring(7);
  } else if (landline.length === LANDLINE_NO_AREA_LENGTH) {
    maskedNumber = "*".repeat(5) + landline.substring(5);
  }

  return padLandline(maskedNumber);
};

export const maskEmail = (email?: string | null) => {
  if (!email) {
    return email;
  }

  const atIndex = email.indexOf("@");

  if (atIndex === -1) {
    return email;
  } else if (atIndex <= 2) {
    return "*".repeat(2) + email.substring(atIndex);
  } else {
    return email[0] + "*".repeat(atIndex - 2) + email.substring(atIndex - 1);
  }
};

export const maskData = (data: z.infer<typeof RawPersonSchema>, masked: boolean): z.infer<typeof RawPersonSchema> => {
  if (!masked) {
    return {
      ...data,
      mobilePhone: padMobileNumber(data.mobilePhone),
      homePhone: padLandline(data.homePhone),
      workPhone: padLandline(data.workPhone),
    };
  } else {
    return {
      ...data,
      mobilePhone: maskMobileNumber(data.mobilePhone),
      homePhone: maskLandline(data.homePhone),
      workPhone: maskLandline(data.workPhone),
      personalEmailAddress: maskEmail(data.personalEmailAddress),
    };
  }
};
