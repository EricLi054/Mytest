import { type TypographyOptions } from '@mui/material/styles/createTypography';
import { theme, themeOptions } from '@racwa/react-components';

const MuiTypography: TypographyOptions = {
  ...themeOptions.typography,
  h1: {
    ...(themeOptions.typography as TypographyOptions).h1,
    [theme.breakpoints.up('md')]: {
      fontSize: 60
    }
  },
  h2: {
    ...(themeOptions.typography as TypographyOptions).h2,
    [theme.breakpoints.up('md')]: {
      fontSize: 40
    }
  },
  h3: {
    ...(themeOptions.typography as TypographyOptions).h3,
    [theme.breakpoints.up('md')]: {
      fontSize: 28
    }
  },
  h4: {
    ...(themeOptions.typography as TypographyOptions).h4,
    [theme.breakpoints.up('md')]: {
      fontSize: 24
    }
  },
  h5: {
    ...(themeOptions.typography as TypographyOptions).h5,
    [theme.breakpoints.up('md')]: {
      fontSize: 18
    }
  }
};

export default MuiTypography;
