"use client";

import type { PersonSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";
import { useEffect } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import { StyledNextLink } from "#components/Links/StyledNextLink";
import { logEvent } from "#utils/analyticsTagging";

import { colors } from "@racwa/styles";

import { AddToAppleWalletButton, AddToGoogleWalletButton } from "../AddToWalletButtons";
import AnimatedDigitalCard from "../AnimatedDigitalCard";

export type AddToWalletMobileModalProps = {
  person?: z.infer<typeof PersonSchema>;
  addToWalletUrl?: string;
};

const AddToWalletMobileModal: React.FC<AddToWalletMobileModalProps> = ({ person, addToWalletUrl }) => {
  useEffect(() => {
    logEvent("Digital card mobile modal");
  }, []);

  if (!person) {
    console.error("No person information provided to DigitalCardModalContent");
    return null;
  }
  return (
    <Grid display="flex" container flexGrow={1} direction="column" justifyContent="space-between">
      <Grid></Grid> {/* Empty Grid - Required to get Modal content centered while FAQ's stay at bottom  */}
      <Grid container direction="column" flexWrap="nowrap" gap={5} textAlign="center" alignItems="center">
        <Grid
          display="flex"
          width={{
            xs: "275px",
            md: "100%",
          }}
          flexDirection="column"
          gap={1}
        >
          <Typography variant="h1" color={colors.dieselDeepest}>
            Your digital card
          </Typography>
          <Typography variant="body1" color={colors.dieselDeeper}>
            <strong>Use the barcode or set up your card in your digital wallet</strong>
          </Typography>
        </Grid>
        <AnimatedDigitalCard person={person} />
        {addToWalletUrl && (
          <Grid display="flex" justifyContent="center" gap={1}>
            <AddToAppleWalletButton
              href={addToWalletUrl}
              googleAnalyticsDescription="Digital card mobile modal - Add to Apple Wallet"
            />
            <AddToGoogleWalletButton
              href={addToWalletUrl}
              googleAnalyticsDescription="Digital card mobile modal - Add to Google Wallet"
            />
          </Grid>
        )}
        {/* Empty Grid - Required to get Gap added to end  */}
        <Grid></Grid>
      </Grid>
      <Grid textAlign="center" width="100%">
        <StyledNextLink
          onClick={() => logEvent("Digital card mobile modal - FAQ click")}
          href="/myrac/help"
          target="_blank"
          sx={{ fontSize: "18px" }}
        >
          Frequently asked questions
        </StyledNextLink>
      </Grid>
    </Grid>
  );
};

export default AddToWalletMobileModal;
