import type { PersonSchema } from "#graphql/person/queries/schema";
import type { EngineeredJourneyProps } from "#types/EngineeredJourneyProps";
import type { JSX } from "react";
import type { z } from "zod";
import { Grid2 as Grid, Typography } from "@mui/material";
import createEngineeredContentComponent from "#components/EngineeredContent/utils";
import { PageTemplateContainer } from "#components/shared/PageTemplateContainer";
import { HeadingWithLinkSection } from "#components/shared/styled";

import { colors } from "@racwa/styles";

import CopyButton from "../CopyButton";
import { RacwaDivider } from "../DataDrivenForm/components/Divider";
import GACldImage from "../GACldImage";
import DigitalCardMembershipContent from "./DigitalMembershipContent";
import { TierBox } from "./TierBox";

// The exceptions map for images that do not have svg version.
const nonSvgImageMap = new Map<string, string>([["myRAC/card-RAC Ignite-v2", "png"]]);

const renderYourMembership = (person: z.infer<typeof PersonSchema>) => {
  return (
    <Grid
      container
      direction="column"
      bgcolor={colors.white}
      padding={{ xs: "1.5rem 1rem", md: "2rem 1.5rem" }}
      textAlign="left"
      gap={3}
    >
      <Grid>
        <Typography variant="h3" color={colors.dieselDeeper}>
          Your membership
        </Typography>
      </Grid>
      <Grid container direction="column" color={colors.dieselDeepest} gap={0.5}>
        <Typography>Member number</Typography>
        <CopyButton text={person.racId} />
        <RacwaDivider />
        <Grid container direction="column" gap={0.5}>
          <Typography>Tier</Typography>
          <TierBox person={person} />
        </Grid>
      </Grid>
    </Grid>
  );
};

function renderRequestPhysicalCard(
  person: z.infer<typeof PersonSchema>,
  RequestCardLink: () => JSX.Element,
  displayRequestCardLink: boolean,
) {
  const imageSrc = person.cardColour ? `myRAC/card-${person.cardColour}-v2` : "myRAC/card-None";
  const format = nonSvgImageMap.has(imageSrc) ? nonSvgImageMap.get(imageSrc) : "svg";

  return (
    <>
      <Grid
        position="relative"
        width={{ xs: "269px", md: "269px" }}
        sx={{
          aspectRatio: "3/2",
        }}
      >
        <GACldImage
          fill
          format={format}
          src={imageSrc}
          alt={imageSrc}
          style={{ borderRadius: 8 }}
          googleAnalyticsDescription="Digital card icon click"
          data-testid="digital-card-icon"
        />
      </Grid>
      {displayRequestCardLink && <RequestCardLink />}
    </>
  );
}

type MembershipPageProps = {
  person: z.infer<typeof PersonSchema>;
} & EngineeredJourneyProps;

const MembershipPage = ({ person, engineeredContent }: MembershipPageProps) => {
  if (!engineeredContent) {
    return null;
  }
  const digitalCardDetails = person.digitalCardDetails;

  const displayRequestCardLink = person.tier.toLowerCase() !== "rac ignite";

  const MembershipTitle = createEngineeredContentComponent("richText", "membership-title")(engineeredContent);
  const RequestCardLink = createEngineeredContentComponent(
    "richText",
    "membership-request-card-link",
  )(engineeredContent);

  return (
    <PageTemplateContainer contentWidth={{ xs: "100%", md: "760px" }} spaceBetweenSections={7}>
      <HeadingWithLinkSection>
        <MembershipTitle />
      </HeadingWithLinkSection>
      <Grid container display="flex" gap={{ xs: "2rem", md: "1.5rem" }} direction={{ xs: "column", md: "row" }}>
        <Grid width={{ xs: "100%", md: "466px" }}>{renderYourMembership(person)}</Grid>
        <Grid
          display="flex"
          gap="1.5rem"
          flexDirection="column"
          alignItems="center"
          width={{ xs: "100%", md: "269px" }}
        >
          {digitalCardDetails?.isActive ? (
            <DigitalCardMembershipContent
              person={person}
              digitalCardDetails={digitalCardDetails}
              engineeredContent={engineeredContent}
              displayRequestCardLink={displayRequestCardLink}
            />
          ) : (
            renderRequestPhysicalCard(person, RequestCardLink, displayRequestCardLink)
          )}
        </Grid>
      </Grid>
    </PageTemplateContainer>
  );
};

export default MembershipPage;
