"use server";

import { getCategorySelectCollection } from "../categorySelectCollection/data";

export async function getCategorySelectComponents(id: string) {
  try {
    return await getCategorySelectCollection(id);
  } catch (error) {
    console.log("Unable to get Category Select Collection: ", error);
    return null;
  }
}
