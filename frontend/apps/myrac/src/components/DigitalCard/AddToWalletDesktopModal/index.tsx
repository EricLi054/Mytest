"use client";

import { useEffect } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import { StyledNextLink } from "#components/Links/StyledNextLink";
import { logEvent } from "#utils/analyticsTagging";
import { QRCodeSVG } from "qrcode.react";

import { colors } from "@racwa/styles";

const AddToWalletDesktopModal = ({ digitalCardUrl }: { digitalCardUrl: string }) => {
  useEffect(() => {
    logEvent("Digital card desktop modal");
  }, []);

  return (
    <Grid container direction="row" flexWrap="nowrap" gap={3}>
      <Grid
        container
        bgcolor={colors.subtleBg}
        justifyContent="center"
        alignItems="center"
        padding={3}
        width="auto"
        borderRadius="8px"
      >
        <QRCodeSVG size={160} title="Get your digital card" value={digitalCardUrl} />
      </Grid>
      <Grid container direction="column" gap={0.5}>
        <Typography variant="body1" fontWeight={400}>
          To add to your mobile wallet
        </Typography>
        <Grid container direction="column" gap={2}>
          <ol style={{ listStyle: "none", paddingLeft: 8, margin: 0 }}>
            <li>
              <Typography variant="body1">1. Scan the QR code with your phone camera.</Typography>
            </li>
            <li>
              <Typography variant="body1">2. Tap the link that appears.</Typography>
            </li>
            <li>
              <Typography variant="body1">3. Follow the steps.</Typography>
            </li>
          </ol>
          <Typography variant="body1">Or you can download your card via myRAC on your mobile phone.</Typography>
          <Typography variant="body2">
            For more information view our{" "}
            <StyledNextLink
              href="/myrac/help"
              target="_blank"
              onClick={() => logEvent("Digital card desktop modal - FAQ click")}
            >
              frequently asked questions
            </StyledNextLink>
            .
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AddToWalletDesktopModal;
