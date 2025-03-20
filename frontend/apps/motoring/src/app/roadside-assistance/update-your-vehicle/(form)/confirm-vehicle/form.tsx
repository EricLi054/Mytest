"use client";

import type { Document } from "@contentful/rich-text-types";
import type { z } from "zod";
import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import BackButton from "#components/BackButton";
import FormLoadingModal from "#components/FormLoadingModal";
import RichTextRenderer from "#components/RichTextRenderer";
import SubmitButton from "#components/SubmitButton";
import { logEvent, logPageView } from "#utils/analyticsTagging";

import { colors } from "@racwa/styles";

import type { ConfirmVehicleAction } from "./actions";
import type { ConfirmVehicleContentfulSchema } from "./schema";

export type ConfirmVehicleFormProps = {
  contentfulData: z.infer<typeof ConfirmVehicleContentfulSchema>;
  confirmVehicleAction: ConfirmVehicleAction;
};

export default function ConfirmVehicleForm({ contentfulData, confirmVehicleAction }: ConfirmVehicleFormProps) {
  useEffect(logPageView, []);

  return (
    <form action={confirmVehicleAction}>
      <FormLoadingModal />
      <Grid container direction={"column"} spacing={3}>
        <Box
          sx={{ display: "flex", flexDirection: "column", padding: "20px" }}
          bgcolor={colors.white}
          border={"1px solid" + colors.dieselLight}
          borderRadius="3px"
          paddingX="8px"
        >
          <Typography>
            <b>{contentfulData.cards.importantInformation.title}</b>
          </Typography>
          <RichTextRenderer json={contentfulData.cards.importantInformation.content.json as Document} />
        </Box>
        <div>
          <SubmitButton>Confirm</SubmitButton>
          <BackButton href="update-vehicle" onClick={() => logEvent("Back to Update vehicle")} />
        </div>
      </Grid>
    </form>
  );
}
