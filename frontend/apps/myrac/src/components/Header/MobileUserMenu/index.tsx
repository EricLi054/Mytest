"use client";

import type { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import type { z } from "zod";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Grid2 as Grid, Stack, Typography } from "@mui/material";
import { logNavClick } from "#utils/analyticsTagging";
import { signIn, signOut, useSession } from "next-auth/react";

import { getADB2CLogoutUrl } from "@racwa/auth/adb2c";
import { RacwaLink } from "@racwa/react-components";
import { CldImage } from "@racwa/ui";

import { StyledCardContainer } from "./styled";

export default function MobileUserMenu({
  memberFullName,
  userMenu,
  mobileLinks,
}: {
  memberFullName: string;
  userMenu: z.infer<z.ZodArray<typeof ContentfulLinkSchema>>;
  mobileLinks: z.infer<z.ZodArray<typeof ContentfulLinkSchema>>;
}) {
  const { status } = useSession();
  const router = useRouter();

  const sessionButtonOnClick = async () => {
    if (status === "authenticated") {
      const logoutUrl = await getADB2CLogoutUrl(window.location.origin);
      logNavClick("myRAC - Log out");
      await signOut();
      router.push(logoutUrl);
    } else {
      await signIn("azure-ad-b2c");
    }
  };
  return (
    <Grid container direction="column" paddingBottom={1}>
      <Stack
        direction="column"
        justifyContent="center"
        gap={1.5}
        paddingY={1}
        boxShadow="0 1px 0 rgba(255,255,255,.1)"
        // This color is non-standard in the design system
        sx={{ backgroundColor: "#111f2a" }}
      >
        {status === "authenticated" && (
          <>
            <Stack direction="row" paddingY={1} paddingX={2} gap={1}>
              <StyledCardContainer>
                <CldImage
                  fill
                  src="myRAC/member-card-yellow"
                  alt="member-card-yellow"
                  onClick={() => {
                    logNavClick("myRAC - Digital card icon");
                  }}
                />
              </StyledCardContainer>
              <Typography
                flexGrow={1}
                sx={{ color: "white" }}
                onClick={() => {
                  logNavClick("myRAC - Full name");
                }}
              >
                {memberFullName}
              </Typography>
            </Stack>
            {userMenu.map((item) => {
              return (
                <RacwaLink
                  key={item.longLinkText}
                  link={item.linkUrl ?? ""}
                  sx={{ paddingX: 2 }}
                  onClick={() => {
                    if (item.googleAnalyticsDescription) {
                      logNavClick(item.googleAnalyticsDescription);
                    }
                  }}
                >
                  {item.longLinkText}
                </RacwaLink>
              );
            })}
          </>
        )}
        <Stack direction="row" paddingY={1} paddingX={2} gap={1}>
          <Button fullWidth color="secondary" href="tel:131703">
            <FontAwesomeIcon icon="phone" style={{ marginRight: 2, fontSize: "12px" }} />
            13 17 03
          </Button>
          <Button fullWidth color="primary" onClick={sessionButtonOnClick}>
            <FontAwesomeIcon icon="user" style={{ marginRight: 2, fontSize: "12px" }} />
            {status === "authenticated" ? "Log out" : "Log in"}
          </Button>
        </Stack>
      </Stack>
      <Stack direction="column" justifyContent="center" gap={1.5} paddingY={1}>
        {mobileLinks.map((item) => {
          return (
            <RacwaLink key={item.longLinkText} link={item.linkUrl ?? ""} sx={{ paddingX: 2 }}>
              {item.longLinkText}
            </RacwaLink>
          );
        })}
      </Stack>
    </Grid>
  );
}
