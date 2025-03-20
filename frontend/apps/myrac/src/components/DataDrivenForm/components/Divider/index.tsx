"use client";

import { Divider, useTheme } from "@mui/material";

export const RacwaDivider = () => {
  const theme = useTheme();
  return <Divider sx={{ margin: `${theme.spacing(1)} 0` }} />;
};
