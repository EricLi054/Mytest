"use client";

import { Button } from "@mui/material";
import { GenericErrorComponent } from "#components/Error/GenericErrorComponent";

export default function NotFound() {
  return (
    <GenericErrorComponent heading="Uh oh!" subHeading="Sorry, we can't find that page">
      <Button variant="contained" color="primary" href="/myRAC" size="medium">
        Back to myRAC
      </Button>
    </GenericErrorComponent>
  );
}
