import { Box, Grid2 as Grid, styled } from "@mui/material";

import { colors } from "@racwa/styles";

export const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  width: "100%",
  padding: `${theme.spacing(3)} ${theme.spacing(2)}`,
  [theme.breakpoints.up("sm")]: {
    maxWidth: theme.spacing(120),
    padding: `${theme.spacing(4)} ${theme.spacing(3)}`,
    borderRadius: 4,
  },
}));

export const StyledIcon = styled(Grid)(({ theme }) => ({
  width: theme.spacing(7),
  "& svg": {
    width: "100%",
    height: "100%",
  },
  [theme.breakpoints.up("sm")]: {
    width: theme.spacing(9),
  },
}));

export const StyledRegoNumber = styled("span")(({ theme }) => ({
  backgroundColor: colors.racGrayLight,
  padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
  borderRadius: "3px",
}));
