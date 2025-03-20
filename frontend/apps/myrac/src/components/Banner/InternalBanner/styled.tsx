"use client";

import { Grid2 as Grid, styled } from "@mui/material";

export const StyledButtonContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    padding: `0 ${theme.spacing(2)} ${theme.spacing(6)} ${theme.spacing(2)}`,
    gap: theme.spacing(1),
  },
  [theme.breakpoints.up("sm")]: {
    flexDirection: "column",
    position: "absolute",
    top: 40,
    right: 0,
    minWidth: 140,
    width: "auto",
  },
}));

export const StyledBannerTextContainer = styled(Grid)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(4),
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    paddingBottom: 78,
    width: "75%",
  },
  [theme.breakpoints.up("md")]: {
    width: "100%",
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(10),
  },
}));

export const StyledBannerText = styled("div")(({ theme }) => ({
  width: "100%",
  color: "white",
  textShadow: "0 0 100px rgba(0,0,0,.4), 0 0 12px rgba(0,0,0,.6), 0 1px 2px rgba(0,0,0,.5)",
  [theme.breakpoints.up("md")]: {
    width: 940,
  },
}));

export const BackgroundImageDiv = styled("div", { shouldForwardProp: (prop) => prop !== "backgroundImage" })<{
  backgroundImage: string;
}>(({ theme, backgroundImage }) => ({
  padding: 0,
  height: theme.spacing(37),
  width: "100%",
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  position: "relative",
  [theme.breakpoints.up("md")]: {
    height: theme.spacing(40),
  },
}));
