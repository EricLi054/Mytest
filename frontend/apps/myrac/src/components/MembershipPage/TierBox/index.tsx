"use client";

import type { PersonSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";
import { Typography } from "@mui/material";
import { logEvent } from "#utils/analyticsTagging";

import { colors } from "@racwa/styles";

import { StyledBox } from "./styled";

const tierColorMap: Record<string, string> = {
  Blue: colors.racBlue,
  Red: colors.brandDanger,
  Bronze: "#BF8A44",
  Silver: "#9C9D9C",
  Gold: "#E5B53B",
  Free2Go: "#A9C3CB",
  "Gold Life": colors.racYellowLight,
  "RAC Ignite": colors.brandWarning,
};

const tierTextColorMap: Record<string, string> = {
  Blue: colors.white,
  Bronze: colors.dieselDeepest,
  Silver: colors.dieselDeepest,
  Gold: colors.dieselDeepest,
  Free2Go: colors.dieselDeepest,
  "Gold Life": colors.dieselDeepest,
  "RAC Ignite": colors.dieselDeepest,
};

export const TierBox = ({ person }: { person: z.infer<typeof PersonSchema> }) => {
  return (
    <StyledBox
      sx={{ bgcolor: tierColorMap[person.cardColour] }}
      onClick={() => {
        logEvent("Digital card - Tier pill");
      }}
    >
      <Typography fontWeight={400} color={tierTextColorMap[person.cardColour]}>
        {person.cardColour.concat(" member")}
      </Typography>
    </StyledBox>
  );
};
