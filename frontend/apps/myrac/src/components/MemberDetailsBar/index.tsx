import type { EngineeredJourneyProps } from "#types/EngineeredJourneyProps";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Grid2 as Grid, Typography } from "@mui/material";

import type { DigitalCardDetails, Person } from "./types";
import InternalContentfulButton from "../Buttons/ContentfulButton/InternalContentfulButton";
import CopyButton from "../CopyButton";
import RACMemberCard from "../DigitalCard/RACMemberCard";
import { StyledBackgroundContainer } from "./index.styled";
import MemberCardImage from "./MemberCardImage";

const hasActiveDigitalCard = (cardDetails: DigitalCardDetails | undefined): boolean => {
  return cardDetails ? cardDetails.isActive : false;
};

function renderMemberCard(person: Person, storageKey: string) {
  if (!person.digitalCardDetails || !hasActiveDigitalCard(person.digitalCardDetails)) {
    return (
      <Grid
        width={{ xs: "73px", md: "98px" }}
        height="fit-content"
        style={{ aspectRatio: "3/2", position: "relative" }}
      >
        <MemberCardImage cardColour={person.cardColour} />
      </Grid>
    );
  }

  return <RACMemberCard person={person} storageKey={storageKey} />;
}
type MemberDetailsBarProps = {
  person: Person;
} & EngineeredJourneyProps;

const MemberDetailsBar = ({ person, engineeredContent }: MemberDetailsBarProps) => {
  const storageKey = engineeredContent?.getById("digital-card-promo-storage-key")?.stringContent ?? "";

  return (
    <StyledBackgroundContainer container justifyContent="center">
      <Grid container flexWrap="nowrap" direction={{ xs: "column", md: "row" }} gap={{ xs: 2, md: 3 }} width="100%">
        <Grid flexGrow={1}>
          <Grid container direction={{ xs: "row-reverse", md: "row" }} gap={4} flexWrap="nowrap">
            {renderMemberCard(person, storageKey)}
            <Grid color="white" flexGrow={1} alignContent="center">
              <Typography variant="h3" color="inherit">
                {person.title} {person.firstName && person.firstName.length > 0 ? person.firstName[0] : ""}{" "}
                {person.surname}
              </Typography>
              {person.cardColour !== "None" && (
                <Grid container gap={0.5} direction={{ xs: "column", md: "row" }} pt={1}>
                  <Typography variant="body1">{person.cardColour} member </Typography>
                  <CopyButton text={person.racId} />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid width={{ xs: "100%", md: "130px" }} alignSelf="center">
          <InternalContentfulButton
            longText="Profile"
            link="/myrac/profile"
            colour="secondary"
            border={true}
            icon={faUser}
            variant="CTA Transparent"
            gavalue="Digital card - Profile button click"
          />
        </Grid>
      </Grid>
    </StyledBackgroundContainer>
  );
};

export default MemberDetailsBar;
