"use client";

import Link from "next/link";
import { Button, MenuList, Paper, styled } from "@mui/material";

import { colors } from "@racwa/styles";

export const StyledDropdownButton = styled(Button)(() => ({
  color: colors.racYellow,
  backgroundColor: colors.dieselDeep,
  padding: "5px 10px",
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "white",
  marginTop: theme.spacing(1),
  minWidth: 160,
}));

export const StyledMenuList = styled(MenuList)(() => ({
  padding: 0,
}));

export const StyledMenuTitle = styled(Link)(() => ({
  padding: "6px 20px",
  width: "100%",
  display: "inline-block",
  fontSize: 24,
  fontWeight: 600,
  color: colors.dieselDeep,
  textDecoration: "none",
  "&:hover": {
    color: colors.dieselDeepest,
  },
}));

export const StyledMenuLink = styled(Link)(() => ({
  padding: "6px 20px",
  whiteSpace: "nowrap",
  color: colors.dieselDeeper,
  backgroundColor: colors.subtleBg,
  textDecoration: "none",
  fontSize: 18,
  fontWeight: 400,
  "&:hover": {
    backgroundColor: colors.racGrayLight,
  },
}));

export const StyledMenuFooter = styled("div")(() => ({
  padding: "6px 20px",
}));

export const StyledLogoutButton = styled(Button)(() => ({
  fontSize: 18,
  fontWeight: 400,
  padding: "5px 18px",
}));
