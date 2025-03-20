"use client";

import type { ButtonProps } from "@mui/material";
import type { PropsWithChildren } from "react";
import { Box, Grid, Link, Button as MuiButton, Typography } from "@mui/material";

import type { HeadingSubText, RacwaStandardPageTemplateProps } from "@racwa/react-components";
import { RacwaStandardPageTemplate } from "@racwa/react-components";
import { colors } from "@racwa/styles";

export type ErrorPageProps = PropsWithChildren<RacwaStandardPageTemplateProps & { heading?: string }>;

// Explicitly declare type for dot exports to work
type Component = React.FC<ErrorPageProps> & {
  Subheading: typeof Subheading;
  Subtext: typeof HeadingSubText;
  Button: typeof Button;
};

export const ErrorPage: Component = ({ heading = "Uh oh!", children, ...props }) => {
  return (
    <div style={{ height: "100dvh" }}>
      <RacwaStandardPageTemplate heading={heading} headerEndAction={<></>} {...props}>
        <Grid
          sx={(theme) => ({
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.palette.common.white,
            padding: "2rem 1rem 2rem 1rem",
            [theme.breakpoints.up("sm")]: {
              padding: "4rem 1.5rem 4rem 1.5rem",
            },
          })}
        >
          <Box
            sx={(theme) => ({
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: theme.spacing(2),
              maxWidth: "520px",
              textAlign: "center",
              [theme.breakpoints.down("sm")]: { alignItems: "flex-start", textAlign: "left" },
            })}
          >
            {children}
          </Box>
        </Grid>
      </RacwaStandardPageTemplate>
    </div>
  );
};

const Subheading = ({ children }: PropsWithChildren) => (
  <Typography color={colors.dieselDeep} fontWeight={700} fontSize={40} sx={{ mb: 2, lineHeight: "40px" }}>
    {children}
  </Typography>
);

const Subtext = ({ children }: PropsWithChildren) => <Typography variant="subtitle1">{children}</Typography>;

const Button = ({ children, ...props }: ButtonProps) => (
  <MuiButton
    variant="contained"
    color="primary"
    sx={(theme) => ({
      marginTop: 2,
      [theme.breakpoints.down("sm")]: {
        width: "100%",
      },
    })}
    LinkComponent={Link}
    {...props}
  >
    {children}
  </MuiButton>
);

ErrorPage.Subheading = Subheading;
ErrorPage.Subtext = Subtext;
ErrorPage.Button = Button;
