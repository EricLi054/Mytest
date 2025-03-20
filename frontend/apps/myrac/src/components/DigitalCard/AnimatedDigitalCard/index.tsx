"use client";

import type { PersonSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";
import { useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid2 as Grid, Typography } from "@mui/material";
import { logEvent } from "#utils/analyticsTagging";

import { colors } from "@racwa/styles";
import { useMobileSwipe } from "@racwa/ui";

import AnimatedDigitalCardInternal from "./AnimatedDigitalCardInternal";

export type AnimatedDigitalCardProps = {
  person?: z.infer<typeof PersonSchema>;
};

const AnimatedDigitalCard: React.FC<AnimatedDigitalCardProps> = ({ person }) => {
  const [showBarcode, setShowBarcode] = useState(false);
  const toggleBarcode = (eventType: "swipe" | "click") => {
    if (eventType === "click") {
      logEvent(
        showBarcode
          ? "Digital card mobile modal - Hide barcode click"
          : "Digital card mobile modal - Show barcode click",
      );
    } else {
      logEvent(
        showBarcode
          ? "Digital card mobile modal - Swipe to hide barcode"
          : "Digital card mobile modal - Swipe to show barcode",
      );
    }
    setShowBarcode(!showBarcode);
  };

  const touchProps = useMobileSwipe({
    onSwipedLeft: () => {
      toggleBarcode("swipe");
    },
    onSwipedRight: () => {
      toggleBarcode("swipe");
    },
  });

  if (!person) {
    console.error("No person information provided to AnimatedDigitalCard");
    return null;
  }

  return (
    <Grid justifyContent="center" alignItems="center" display="flex" flexDirection="column" gap={1}>
      <Grid display="flex" flexDirection="column" gap={1}>
        <Grid>
          <AnimatedDigitalCardInternal
            showBarcode={showBarcode}
            person={person}
            {...(person.membershipCardNumber ? touchProps : undefined)}
          />
        </Grid>
        {person.membershipCardNumber && (
          <Grid display="flex" flexDirection="row" justifyContent="flex-end">
            <Typography
              variant="body2"
              color={colors.linkBlue}
              width="100%"
              sx={{ cursor: "pointer", fontWeight: 400, textAlign: "right" }}
              onClick={() => {
                toggleBarcode("click");
              }}
            >
              <FontAwesomeIcon icon={showBarcode ? faEyeSlash : faEye} style={{ marginRight: 4 }} />
              {showBarcode ? "Hide barcode" : "Show barcode"}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default AnimatedDigitalCard;
