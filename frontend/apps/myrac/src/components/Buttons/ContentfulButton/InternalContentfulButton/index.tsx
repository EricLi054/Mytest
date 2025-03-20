"use client";

import type { ContentfulButtonSchema } from "#graphql/sharedSchema/buttonSchema";
import type { z } from "zod";
import { useMemo } from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import FontAwesomeIcon from "#clientWrappers/FontAwesomeIcon";
import { useEnvironmentVariables } from "#providers/environmentVariables/context";

import { CldImage } from "@racwa/ui";

import {
  BreakpointControlledText,
  StyledBannerButton,
  StyledButton,
  StyledChevronButton,
  StyledFAIcon,
  StyledIconButton,
  StyledImageButton,
  StyledProfileLinkButton,
} from "./styled";

type InternalContentfulButtonProps = {
  gavalue?: string;
} & z.infer<typeof ContentfulButtonSchema>;

function InternalContentfulButton({
  longText,
  shortText,
  image,
  link,
  icon,
  colour,
  border,
  variant,
  gavalue,
}: InternalContentfulButtonProps) {
  const { ONLINE_SHOP_URL, B2C_URL } = useEnvironmentVariables();

  const replacedLink = useMemo(() => {
    return link.replace("{{onlineShopUrl}}", ONLINE_SHOP_URL).replace("{{b2cUrl}}", B2C_URL);
  }, [link, ONLINE_SHOP_URL, B2C_URL]);

  switch (variant) {
    case "Image":
      return (
        <StyledImageButton href={replacedLink} gavalue={gavalue ?? longText}>
          <Grid container direction={{ xs: "row", md: "column" }} alignItems="center" width="100%">
            {image && image.length > 0 && image[0] && (
              <Grid width={{ xs: "2em", md: "30%" }} sx={{ aspectRatio: "1/1" }} position="relative">
                <CldImage src={image[0].secureUrl} fill alt={longText} />
              </Grid>
            )}
            <Grid>{longText}</Grid>
          </Grid>
        </StyledImageButton>
      );
    case "Profile Link":
      return (
        <StyledProfileLinkButton href={replacedLink} gavalue={gavalue ?? longText}>
          <Grid
            container
            direction={{ xs: "row", sm: "column" }}
            gap={{ xs: 2, sm: 4 }}
            width="100%"
            textAlign="start"
            flexWrap="nowrap"
          >
            {icon && (
              <Grid width={16}>
                <StyledFAIcon icon={icon} />
              </Grid>
            )}
            <Grid container direction="column" width="auto" gap={{ xs: 0, sm: 1 }} flexGrow={1}>
              <Typography variant="h4" fontSize={{ xs: 18, sm: 24 }}>
                {longText}
              </Typography>
              <Typography variant="body1" fontSize={{ xs: 14, sm: 18 }}>
                {shortText}
              </Typography>
            </Grid>
            <Grid sx={{ display: { xs: "block", sm: "none" } }}>
              <FontAwesomeIcon icon="chevron-right" fontSize={14} />
            </Grid>
          </Grid>
        </StyledProfileLinkButton>
      );
    case "Icon CTA":
      return (
        <StyledIconButton
          fullWidth
          color={colour ?? undefined}
          border={border ?? false}
          href={replacedLink}
          gavalue={gavalue ?? longText}
        >
          {icon && <FontAwesomeIcon icon={icon} style={{ marginRight: "8px" }} />}
          {longText}
        </StyledIconButton>
      );
    case "CTA Transparent":
      return (
        <StyledIconButton
          fullWidth
          color={colour ?? undefined}
          border={border ?? false}
          href={replacedLink}
          sx={{ background: "transparent" }}
          gavalue={gavalue ?? longText}
        >
          {icon && <FontAwesomeIcon icon={icon} style={{ marginRight: "8px" }} />}
          {longText}
        </StyledIconButton>
      );
    case "Chevron":
      return (
        <StyledChevronButton fullWidth color={colour ?? undefined} href={replacedLink} gavalue={gavalue ?? longText}>
          {icon && <FontAwesomeIcon icon={icon} style={{ marginRight: "8px" }} />}
          {longText}
        </StyledChevronButton>
      );
    case "Banner":
      return (
        <StyledBannerButton
          color={colour ?? undefined}
          href={replacedLink}
          gavalue={`Click - Banner Link - ${longText}`}
        >
          {icon && <FontAwesomeIcon size="sm" icon={icon} style={{ minWidth: 15 }} />}
          <BreakpointControlledText deviceVisibility="mobile">{shortText ?? longText}</BreakpointControlledText>
          <BreakpointControlledText deviceVisibility="desktop">{longText}</BreakpointControlledText>
        </StyledBannerButton>
      );
    case "Regular":
    default:
      return (
        <StyledButton href={replacedLink} gavalue={gavalue ?? longText}>
          {longText}
        </StyledButton>
      );
  }
}

export default InternalContentfulButton;
