import type { Action, DropdownLink } from "#components/PolicyDetailsRenderer/types";

// Define a conversion function to convert Action[] to DropdownLink[]
export const convertToDropdownLinks = (actions: Action[]): DropdownLink[] => {
  return actions.map((action) => ({
    label: action.label ?? "",
    subLabel: action.subLabel ?? "",
    link: action.link ?? "", // Assuming the link property in Action maps to the href property in DropdownLink
    analytics: action.analytics ?? { description: "" }, // Assuming the analytics property in Action maps to the analytics property in DropdownLink
  }));
};
