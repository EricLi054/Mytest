import { Grid2 as Grid, styled } from "@mui/material";

import { RacwaStandardPageTemplate } from "@racwa/react-components";

export const StyledRacwaStandardPageTemplate = styled(RacwaStandardPageTemplate)(() => ({
  h1: {
    maxWidth: 800,
  },
}));

export const StyledChildrenContainer = styled(Grid)(({ theme }) => ({
  gap: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  a: {
    marginTop: theme.spacing(1),
  },
  [theme.breakpoints.up("md")]: {
    alignItems: "center",
  },
}));
