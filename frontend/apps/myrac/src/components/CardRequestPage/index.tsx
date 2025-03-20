"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Grid2 as Grid, Typography } from "@mui/material";
import { CardAlreadyOrderedErrorSchema } from "#graphql/person/mutations/schema";
import { useLoadingContext } from "#providers/loading/context";
import { logEvent } from "#utils/analyticsTagging";
import { errorPages } from "#utils/errorPages";

import { colors } from "@racwa/styles";
import { StyledLink } from "@racwa/ui";

import type { RequestPhysicalCardResponse } from "./types";

export type CardRequestFormProps = {
  unmaskedFormattedAddress?: string;
  requestPhysicalCard: () => Promise<RequestPhysicalCardResponse | null>;
};

const cardRequestSuccessUrl = "/myrac/profile/membership/request-a-card/card-request-sent";

const CardRequestForm: React.FC<CardRequestFormProps> = ({ unmaskedFormattedAddress, requestPhysicalCard }) => {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const { openLoadingIndicator, closeLoadingIndicator } = useLoadingContext();

  useEffect(() => {
    // To prevent delay between loading screen closing and route changing
    return () => {
      closeLoadingIndicator();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateAddress = () => {
    logEvent("Update address in your contact details");
    router.push(`/myrac/update-my-details?return_url=${encodeURIComponent(window.location.href)}`);
  };

  const handleRequestCard = async () => {
    try {
      setSubmitted(true);
      logEvent("Request card");
      openLoadingIndicator("Requesting your plastic card…");
      const result = await requestPhysicalCard();

      if (isDuplicateCardOrderedError(result)) {
        router.push(errorPages.physicalCardAlreadyOrdered);
        return;
      }

      if (isGenericError(result)) {
        router.push(errorPages.unhandledError);
        return;
      }

      router.push(cardRequestSuccessUrl);
    } catch {
      router.push(errorPages.unhandledError);
    }
  };

  return (
    <Grid container direction="column">
      <Grid>
        <Grid container direction="column" gap={1}>
          <Grid>
            <Typography color={colors.dieselDeepest} variant="h5">
              Your mailing address:
            </Typography>
          </Grid>
          <Grid>
            <Typography color={colors.dieselDeepest} variant="h4" fontSize={"1.5rem"}>
              {unmaskedFormattedAddress ?? "No Address Specified"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid pt={3}>
        <Typography variant="body1" color={colors.dieselDeeper}>
          Update address in your{" "}
          <StyledLink onClick={handleUpdateAddress} sx={{ pointerEvents: submitted ? "none" : "all" }}>
            contact details
          </StyledLink>
          .
        </Typography>
      </Grid>

      <Grid pt={"40px"}>
        <Button color="primary" fullWidth onClick={handleRequestCard} disabled={submitted}>
          Request card
        </Button>
      </Grid>
    </Grid>
  );
};

const isDuplicateCardOrderedError = (result: RequestPhysicalCardResponse) =>
  result?.requestPhysicalCard?.errors?.some((e) => CardAlreadyOrderedErrorSchema.safeParse(e).success) ?? false;

const isGenericError = (result: RequestPhysicalCardResponse) =>
  !result?.requestPhysicalCard?.physicalCardResponse?.isSuccess;

export default CardRequestForm;
