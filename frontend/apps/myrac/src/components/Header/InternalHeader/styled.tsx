import { Button, Grid2 as Grid, styled } from "@mui/material";

import { RacwaResponsiveHeader } from "@racwa/react-components";
import { colors } from "@racwa/styles";

export const StyledResponsiveHeader = styled(RacwaResponsiveHeader)(({ theme }) => ({
  // Without zIndex the box shadow is hidden by the banner image
  zIndex: 1,
  // Hide the breadcrumbs and separator on mobile
  "& .MuiBreadcrumbs-li:not(:first-of-type)": {
    display: { xs: "none", md: "block" },
  },
  "& .MuiBreadcrumbs-separator": {
    display: { xs: "none", md: "block" },
  },
  // TODO: This is not ideal, but adds styling to the mobile top bar so our buttons style correctly
  // don't want to make a change to the design system otherwise it will disturb insurance
  [theme.breakpoints.down("md")]: {
    "& .MuiGrid-container:first-of-type:not(:only-child)": {
      padding: 0,
      "& .MuiGrid-item:first-of-type": {
        height: "100%",
      },
      "& .MuiGrid-item:last-of-type": {
        height: "100%",
      },
    },
  },
}));

export const StyledFlexibleContainer = styled(Grid)(() => ({
  backgroundColor: colors.dieselDeepest,
}));

export const StyledSearchButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ open }) => ({
  padding: 0,
  border: 0,
  borderRadius: 0,
  height: "100%",
  color: open ? colors.white : "unset",
  backgroundColor: open ? colors.dieselDeepest : "transparent",
  "&:hover": {
    backgroundColor: open ? colors.dieselDeepest : "transparent",
  },
}));
