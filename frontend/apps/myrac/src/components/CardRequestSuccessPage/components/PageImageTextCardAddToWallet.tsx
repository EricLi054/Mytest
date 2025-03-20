"use client";

import type { DigitalCardDetails } from "#components/MemberDetailsBar/types";
import { Grid2 as Grid } from "@mui/material";
import { AddToAppleWalletButton, AddToGoogleWalletButton } from "#components/DigitalCard";
import AddToWalletDesktopModal from "#components/DigitalCard/AddToWalletDesktopModal";
import { GALink } from "#components/Links/GALink";
import { useDeviceDetection } from "#components/shared/useDeviceDetection";
import { useModalContext } from "#providers/modal/context";
import { logEvent } from "#utils/analyticsTagging";

import { StyledLink } from "@racwa/ui";

type PageImageTextCardAddToWalletProps = {
  cardDetails?: DigitalCardDetails;
};

export const PageImageTextCardAddToWallet = ({ cardDetails }: PageImageTextCardAddToWalletProps) => {
  const { isMobile, isTablet, isDesktop } = useDeviceDetection();
  const { openModal, closeModalWithEvent } = useModalContext();
  if (!cardDetails?.passUrl) {
    throw Error("No Digital Pass URL Found");
  }

  const openQRCodeModal = () => {
    if (!cardDetails.passUrl) {
      throw Error("No Digital Pass URL Found");
    }
    logEvent("Get a digital card now");
    openModal("Get your digital card now", <AddToWalletDesktopModal digitalCardUrl={cardDetails.passUrl} />, () => {
      closeModalWithEvent("Digital card desktop modal - Close");
    });
  };

  if (isDesktop || isTablet) {
    return (
      <StyledLink onClick={openQRCodeModal} sx={{ fontSize: 18 }}>
        Get a digital card now
      </StyledLink>
    );
  } else if (isMobile) {
    return (
      <Grid container direction="column" gap={{ xs: 3, sm: 1 }}>
        <Grid container direction="row" justifyContent={{ xs: "center", sm: "flex-start" }} gap={1}>
          <AddToAppleWalletButton
            href={cardDetails.passUrl}
            height={43}
            width={134}
            googleAnalyticsDescription="Add to Apple Wallet"
          />
          <AddToGoogleWalletButton
            href={cardDetails.passUrl}
            height={43}
            width={153}
            googleAnalyticsDescription="Add to Google Wallet"
          />
        </Grid>
        <GALink
          href="/myrac/help"
          sx={{ fontSize: 18 }}
          googleAnalyticsDescription="Frequently asked questions"
          target="_blank"
        >
          Frequently asked questions
        </GALink>
      </Grid>
    );
  } else {
    return false;
  }
};
