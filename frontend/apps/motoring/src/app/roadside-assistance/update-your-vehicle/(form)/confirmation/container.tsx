"use client";

import type { Document } from "@contentful/rich-text-types";
import type { z } from "zod";
import { useEffect } from "react";
import Link from "next/link";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import RichTextRenderer from "#components/RichTextRenderer";
import { logEvent, logPageView } from "#utils/analyticsTagging";

import { CarGRFX001, MotorcycleGRFX016 } from "@racwa/react-components";
import { colors } from "@racwa/styles";

import type { SearchedVehicleDetail } from "../../types";
import type { ConfirmationPageSchema } from "./schema";

export type ConfirmationContainerProps = {
  firstName: string;
  vehicleType: SearchedVehicleDetail["vehicleType"];
  myRacUrl: string;
  contentfulData: z.infer<typeof ConfirmationPageSchema>;
};

const InsuranceCard: React.FC<{
  isCar: boolean;
  contentfulData: ConfirmationContainerProps["contentfulData"];
}> = ({ isCar, contentfulData }) => {
  const cardData = isCar ? contentfulData.cards.carInsuranceCard : contentfulData.cards.motorcycleInsuranceCard;

  const GraphicComponent = isCar ? CarGRFX001 : MotorcycleGRFX016;

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: "8px" }}
      bgcolor={colors.white}
      border={"1px solid" + colors.dieselLight}
      borderRadius="3px"
      paddingX="8px"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 0,
          "& svg": {
            height: "108px",
            width: "108px",
            margin: 0,
          },
        }}
      >
        <GraphicComponent />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", textAlign: "left", paddingY: "16px", gap: "8px" }}>
        <Typography fontWeight={400} color={colors.dieselDeep}>
          {cardData.title}
        </Typography>
        <RichTextRenderer json={cardData.content.json as Document} paragraphProps={{ fontSize: "14px" }} />
      </Box>
    </Box>
  );
};

export const ConfirmationContainer: React.FC<ConfirmationContainerProps> = ({
  firstName,
  vehicleType,
  myRacUrl,
  contentfulData,
}) => {
  const isCar = vehicleType === "CAR";

  useEffect(() => {
    logPageView();
    logEvent(`If you have ${isCar ? "car" : "motorcycle"} insurance`);
  }, [isCar]);

  return (
    <Grid container spacing={5} sx={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <Grid size={12}>
        <FontAwesomeIcon icon={faThumbsUp} size="7x" style={{ color: colors.dieselDeeper }} />
      </Grid>
      <Grid size={12}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <Typography variant="h2" sx={{ fontWeight: "600" }}>
            {contentfulData.heading && contentfulData.heading.trim() !== ""
              ? contentfulData.heading
              : `You're all set, ${firstName}!`}
          </Typography>
          <Typography sx={{ fontWeight: "400", color: colors.dieselDeep }}>{contentfulData.subheading}</Typography>
        </Box>
      </Grid>
      <Grid size={12}>
        <InsuranceCard isCar={isCar} contentfulData={contentfulData} />
      </Grid>
      <Grid size={12}>
        <Button
          variant="contained"
          color="primary"
          href={myRacUrl}
          LinkComponent={Link}
          fullWidth
          onClick={() => logEvent("Back to myRAC")}
        >
          Back to myRAC
        </Button>
      </Grid>
    </Grid>
  );
};
