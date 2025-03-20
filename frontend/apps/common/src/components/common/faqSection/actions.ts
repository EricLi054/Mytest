"use server";

import { getFaqSection } from "./data";

export async function getFaqSectionCollection(id: string) {
  try {
    return await getFaqSection(id);
  } catch (error) {
    console.log("Unable to get FAQ Sections: ", error);
    return null;
  }
}
