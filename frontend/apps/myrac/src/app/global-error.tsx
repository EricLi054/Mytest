"use client";

import { Button, Typography } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { GenericErrorComponent } from "#components/Error/GenericErrorComponent";
import { StyledNextLink } from "#components/Links/StyledNextLink";
import { MyRACThemeProvider } from "#theme";
import { logEvent } from "#utils/analyticsTagging";

import { colors } from "@racwa/styles";

const logPhoneCallEvent = () => {
  logEvent("Error page - Call Us");
};

export default function GlobalError(): React.ReactElement {
  return (
    <html lang="en">
      <body>
        <MyRACThemeProvider injectFirst={false}>
          <AppRouterCacheProvider>
            <GenericErrorComponent>
              <Typography color={colors.dieselDeeper} variant="body1">
                Please try again later or call us on{" "}
                <StyledNextLink href="tel:131703" onClick={logPhoneCallEvent}>
                  13 17 03
                </StyledNextLink>
                .
              </Typography>
              <Button variant="contained" color="primary" href="/myRAC" size="medium">
                Back to myRAC
              </Button>
            </GenericErrorComponent>
          </AppRouterCacheProvider>
        </MyRACThemeProvider>
      </body>
    </html>
  );
}
