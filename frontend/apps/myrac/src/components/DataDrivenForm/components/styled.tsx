"use client";

import { Button, styled } from "@mui/material";

export const StyledEditButton = styled(Button)(({ theme }) => ({
  padding: "5px 10px",
  minWidth: theme.spacing(6.5),
  height: theme.spacing(4),
  fontSize: "14px",
  [theme.breakpoints.up("sm")]: {
    minWidth: theme.spacing(12),
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "18px",
    height: theme.spacing(6),
  },
}));
