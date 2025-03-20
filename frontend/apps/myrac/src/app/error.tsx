"use client";

import { useEffect } from "react";
import { Button, Typography } from "@mui/material";
import { GenericErrorComponent } from "#components/Error/GenericErrorComponent";
import { StyledNextLink } from "#components/Links/StyledNextLink";
import { GTMPageView } from "#components/shared/GTMPageView";
import { logEvent } from "#utils/analyticsTagging";
import { signIn } from "next-auth/react";

import { colors } from "@racwa/styles";

const logPhoneCallEvent = () => {
  logEvent("Error page - Call Us");
};

export default function Error({ error }: { error: Error; reset: () => void }): React.ReactElement {
  useEffect(() => {
    // TODO: Log the error to an error reporting service
    if (error.message === "Unauthorized") {
      void signIn("azure-ad-b2c", { callbackUrl: window.location.href });
    }
  }, [error]);

  return (
    <>
      <GTMPageView />
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
    </>
  );
}
