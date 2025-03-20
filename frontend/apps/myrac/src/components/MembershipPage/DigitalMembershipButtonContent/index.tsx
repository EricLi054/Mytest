"use client";

import type { DigitalCardDetailsSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";
import { Button, Grid2 as Grid } from "@mui/material";
import { AddToAppleWalletButton, AddToGoogleWalletButton } from "#components/DigitalCard";
import AddToWalletDesktopModal from "#components/DigitalCard/AddToWalletDesktopModal";
import { useDeviceDetection } from "#components/shared/useDeviceDetection";
import { useModalContext } from "#providers/modal/context";
import { logEvent } from "#utils/analyticsTagging";

const DigitalCardMembershipButtonContent = ({
  digitalCardDetails,
}: {
  digitalCardDetails: z.infer<typeof DigitalCardDetailsSchema> | undefined;
}) => {
  const { openModal, closeModalWithEvent } = useModalContext();
  const { isDesktop, isTablet, isMobile } = useDeviceDetection();

  if (!digitalCardDetails) {
    console.error("No digital card details provided to DigitalCardMembershipButtonComponent");
    return null;
  }

  function openDigitalCardModal(): void {
    if (!digitalCardDetails) return;
    if (isDesktop || isTablet) {
      logEvent("Find out more");
      openModal(
        "Get your digital card now",
        <AddToWalletDesktopModal digitalCardUrl={digitalCardDetails.passUrl ?? ""} />,
        () => {
          closeModalWithEvent("Digital card desktop modal - Close");
        },
      );
    }
  }

  function renderFindOutMoreButton() {
    return (
      <Button
        variant="contained"
        color="secondary"
        size="medium"
        sx={{ width: "fit-content" }}
        onClick={openDigitalCardModal}
      >
        Find out more
      </Button>
    );
  }

  function render(digitalCardDetails: z.infer<typeof DigitalCardDetailsSchema> | undefined) {
    if (!digitalCardDetails) return null;
    if (isDesktop || isTablet) {
      return renderFindOutMoreButton();
    } else if (isMobile) {
      return (
        <Grid display="flex" justifyContent="center" gap={1}>
          <AddToAppleWalletButton
            href={digitalCardDetails.passUrl ?? ""}
            googleAnalyticsDescription="Add to Apple Wallet"
          />
          <AddToGoogleWalletButton
            href={digitalCardDetails.passUrl ?? ""}
            googleAnalyticsDescription="Add to Google Wallet"
          />
        </Grid>
      );
    }
  }

  return <>{render(digitalCardDetails)}</>;
};

export default DigitalCardMembershipButtonContent;
