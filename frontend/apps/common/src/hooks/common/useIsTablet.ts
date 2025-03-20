"use client";

import { useMediaQuery, useTheme } from "@mui/material";

export const useIsTablet = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("md"));
};
