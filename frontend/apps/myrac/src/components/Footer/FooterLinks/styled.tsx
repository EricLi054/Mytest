"use client";

import { styled } from "@mui/material";

import { DataDrivenRacwaFooter } from "@racwa/react-components";

export const StyledDataDrivenRacwaFooter = styled(DataDrivenRacwaFooter)(({ theme }) => ({
  // TODO: This is not ideal, but adds styling to the list of links in the centre
  // don't want to make a change to the design system otherwise it will disturb insurance
  "& .MuiGrid-root:nth-of-type(2)": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& a": {
      [theme.breakpoints.down("md")]: {
        fontSize: "14px",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "18px",
      },
    },
  },
}));
