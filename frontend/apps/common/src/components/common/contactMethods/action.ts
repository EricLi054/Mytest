"use server";

import { getContactMethods } from "./data";

export async function getContactMethodsSection(id: string) {
  try {
    return await getContactMethods(id);
  } catch (error) {
    console.log("Unable to get Contact Methods Sections: ", error);
    return null;
  }
}
