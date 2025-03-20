export const getAccentColourFromCategoryColour = (categoryColour: string): string => {
  switch (categoryColour.toLowerCase()) {
    case "red":
      return "#ea1f23";
    case "orange":
      return "#f16e00";
    case "green":
      return "#62a602";
    case "navy":
      return "#0c376b";
    case "pink":
      return "#cb0263";
    case "purple":
      return "#aa0fdd";
    case "blue":
      return "#029ed6";
    default:
      return "#0C376B";
  }
};
