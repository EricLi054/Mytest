import type { DigitalCardDetailsSchema, PersonSchema } from "#graphql/person/queries/schema";
import type { EngineeredContentCollection } from "#types/EngineeredJourneyProps";
import type { z } from "zod";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid2 as Grid, Stack, Typography } from "@mui/material";
import DigitalCardFront from "#components/DigitalCard/DigitalCardFront";
import createEngineeredContentComponent from "#components/EngineeredContent/utils";

import DigitalCardMembershipButtonContent from "../DigitalMembershipButtonContent";

const DigitalCardMembershipContent = ({
  person,
  digitalCardDetails,
  engineeredContent,
  displayRequestCardLink,
}: {
  person: z.infer<typeof PersonSchema>;
  digitalCardDetails: z.infer<typeof DigitalCardDetailsSchema>;
  engineeredContent: EngineeredContentCollection;
  displayRequestCardLink: boolean;
}) => {
  const RequestCardLink = createEngineeredContentComponent(
    "richText",
    "membership-request-card-link",
  )(engineeredContent);

  return (
    <Grid container gap="24px" width="100%">
      <Grid width={{ xs: "100%", sm: "343px" }} data-testid="digital-card-front">
        <DigitalCardFront person={person} googleAnalyticsDescription="Digital card icon click" />
      </Grid>
      <Grid direction="column" textAlign="start">
        <Grid direction="column" textAlign="start" width="100%">
          <Typography fontWeight={400} fontSize="18px">
            Get your digital card
          </Typography>
          <Grid marginTop="8px">
            {renderCheckText("Always in your phone.")}
            {renderCheckText("Easy to redeem discounts.")}
          </Grid>
          <Grid marginTop="16px">
            <DigitalCardMembershipButtonContent digitalCardDetails={digitalCardDetails} />
          </Grid>
        </Grid>
        <Grid marginTop="24px" display="flex" alignContent="flex-start">
          {displayRequestCardLink && <RequestCardLink />}
        </Grid>
      </Grid>
    </Grid>
  );

  function renderCheckText(text: string) {
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <FontAwesomeIcon size="sm" icon={faCheck} />
        <Typography fontWeight={300} fontSize="16px" lineHeight="26px">
          {text}
        </Typography>
      </Stack>
    );
  }
};

export default DigitalCardMembershipContent;
