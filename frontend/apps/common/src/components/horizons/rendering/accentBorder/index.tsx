"use client";

import type { Category } from "#types/horizons/category";
import { Box, styled } from "@mui/material";
import { getAccentColourFromCategoryColour } from "#utils/horizons/getAccentColourFromCategoryColour";

const StyledAccentBorder = styled(Box, {
  shouldForwardProp: (prop) => prop !== "category",
})<{ category: Category }>(({ theme, category }) => ({
  position: "absolute",
  left: "-32px",
  top: 0,
  bottom: 0,
  width: 8,
  backgroundColor: getAccentColourFromCategoryColour(category.colour),
  [theme.breakpoints.down("md")]: {
    width: 6,
  },
  [theme.breakpoints.down("sm")]: {
    width: 4,
  },
}));

type AccentBorderProps = {
  category: Category;
};

const AccentBorder = ({ category }: AccentBorderProps) => {
  return <StyledAccentBorder category={category} />;
};

export default AccentBorder;
