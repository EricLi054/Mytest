import type { TypographyOptions } from "@mui/material/styles/createTypography";

import { theme } from "@racwa/react-components";

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
const MuiTypography: TypographyOptions = {
  ...theme.typography,
  h1: {
    ...(theme.typography as TypographyOptions).h1,
    [theme.breakpoints.up("md")]: {
      fontSize: 60,
    },
  },
  h2: {
    ...(theme.typography as TypographyOptions).h2,
    [theme.breakpoints.up("md")]: {
      fontSize: 40,
    },
  },
  h3: {
    ...(theme.typography as TypographyOptions).h3,
    [theme.breakpoints.up("md")]: {
      fontSize: 28,
    },
  },
  h4: {
    ...(theme.typography as TypographyOptions).h4,
    [theme.breakpoints.up("md")]: {
      fontSize: 24,
    },
  },
  h5: {
    ...(theme.typography as TypographyOptions).h5,
    [theme.breakpoints.up("md")]: {
      fontSize: 18,
    },
  },
};

export default MuiTypography;
