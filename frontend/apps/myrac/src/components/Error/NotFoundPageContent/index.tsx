import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Button, Grid2 as Grid, Typography } from "@mui/material";
import FontAwesomeIcon from "#clientWrappers/FontAwesomeIcon";
import { StyledImageButton } from "#components/Buttons/ContentfulButton/InternalContentfulButton/styled";

import { colors } from "@racwa/styles";

import {
  StyledBannerGrid,
  StyledContentWrapperGrid,
  StyledExpandingSpacerGrid,
  StyledIcon,
  StyledSectionGrid,
  StyledSectionHeading,
} from "./styled";

const IconButton = ({ icon, label }: { icon: IconProp; label: string }) => {
  return (
    <Grid width={{ xs: "100%", md: "20%" }} flexGrow={1}>
      <StyledImageButton href="/">
        <Grid container direction={{ xs: "row", md: "column" }} gap={1} alignItems="center">
          <StyledIcon icon={icon} />
          <Grid>{label}</Grid>
        </Grid>
      </StyledImageButton>
    </Grid>
  );
};

export default function NotFoundPageContent() {
  return (
    <>
      <StyledBannerGrid>
        <Typography variant="h1" textAlign="center" color={colors.white} fontSize={{ xs: 32, md: 60 }}>
          404
        </Typography>
      </StyledBannerGrid>
      <StyledContentWrapperGrid>
        <Typography color={colors.dieselDeep} fontWeight={400} fontSize={{ xs: 20, md: 27 }}>
          Uh oh! We seem to be missing some parts
        </Typography>
        <Typography color={colors.dieselDeeper}>Sorry, we can't find the page that you're looking for.</Typography>
      </StyledContentWrapperGrid>
      <StyledExpandingSpacerGrid>
        <StyledSectionGrid>
          <StyledSectionHeading variant="h2">Learn more about RAC</StyledSectionHeading>
          <Grid container direction={{ xs: "column", md: "row" }} width={{ xs: "95%", md: "960px" }} gap={2}>
            <IconButton icon="car" label="Little Yellow Vans" />
            <IconButton icon="calendar" label="RAC Milestones" />
            <IconButton icon="map" label="Membership card" />
            <IconButton icon="comments" label="Feedback" />
          </Grid>
        </StyledSectionGrid>
        <StyledSectionGrid width={{ xs: "100%", md: "960px" }} paddingY={{ xs: 3, md: 6.5 }} bgcolor={colors.white}>
          <StyledSectionHeading variant="h2">Let&apos;s get you back on the road</StyledSectionHeading>
          <Button variant="contained" color="primary" href="/" size="large">
            <FontAwesomeIcon icon="home" style={{ marginRight: 2 }} />
            Return home
          </Button>
        </StyledSectionGrid>
      </StyledExpandingSpacerGrid>
    </>
  );
}
