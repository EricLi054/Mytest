"use client";

import type { Theme } from "@mui/material";
import type { AlertSchema } from "#graphql/policyDetails/schema";
import type { z } from "zod";
import { useMemo } from "react";
import { Button, Grid2 as Grid, Stack, useMediaQuery, useTheme } from "@mui/material";
import { logEvent } from "#utils/analyticsTagging";
import convertStringToElements from "#utils/convertStringToElements";

import { BodyCopy, DesktopH3, getProductTypeIcon, MobileH3, RacwaCardNotification } from "@racwa/react-components";

import type { Action, PolicyDetailsCardContent, PolicyItem } from "../types";
import DropdownButton from "../DropdownButton";
import { StyledIcon, StyledRegoNumber } from "../PolicyDetailsCard/styled";
import { PolicyItemComponent } from "../PolicyItem";
import { convertToDropdownLinks } from "./util";

type Alert = z.infer<typeof AlertSchema>;
type ActionType = "primary" | "secondary" | "info";
type SeverityType = "error" | "info" | "success" | "warning";

export function CardContent(data: PolicyDetailsCardContent) {
  const theme: Theme = useTheme();
  const mobileQuery = theme.breakpoints.down("md");
  // TODO: Refactor this to not use the media query hook due to the issues it can cause
  const isMobile = useMediaQuery(mobileQuery);

  const productIcon = useMemo(() => {
    return <StyledIcon>{getProductTypeIcon(data.type ?? "")}</StyledIcon>;
  }, [data.type]);

  const policyHeader = useMemo(() => {
    const HeaderComponent = isMobile ? MobileH3 : DesktopH3;
    // TODO: Figure out why subtitleSecondary can be '{}'
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let subtitleSecondary = data.subtitleSecondary;
    if (JSON.stringify(data.subtitleSecondary) === "{}") {
      subtitleSecondary = null;
    }
    return (
      <Grid flex={isMobile ? 1 : undefined}>
        {data.title ? <HeaderComponent>{data.title}</HeaderComponent> : null}
        {data.subtitle ? (
          <BodyCopy fontWeight="medium">
            <span style={{ paddingRight: 8 }}>{data.subtitle} </span>
            {data.registrationNumber ? <StyledRegoNumber>{data.registrationNumber}</StyledRegoNumber> : ""}
          </BodyCopy>
        ) : null}
        {subtitleSecondary ? (
          <BodyCopy fontSize="medium" fontWeight="light">
            {data.subtitleSecondary}
          </BodyCopy>
        ) : null}
      </Grid>
    );
  }, [data.title, data.subtitle, data.subtitleSecondary, data.registrationNumber, isMobile]);

  const actions = useMemo(() => {
    const policyCardTitle = data.title ?? "";
    return (
      <Grid flex={isMobile ? undefined : "1 0 0"}>
        <Grid
          container
          direction={isMobile ? "column" : "row"}
          justifyContent={isMobile ? undefined : "flex-end"}
          gap={2}
          flexWrap={isMobile ? undefined : "nowrap"}
        >
          {data.actions?.map((action: Action, index: number) => {
            const width = isMobile
              ? "100%"
              : data.actions?.length === 1
                ? theme.spacing(49)
                : data.actions?.length === 2
                  ? theme.spacing(23.5)
                  : theme.spacing(15);
            if (action.subActions && action.subActions.length > 0) {
              return (
                <DropdownButton
                  primaryLabel={`${action.label} - ${policyCardTitle}`}
                  menuItems={convertToDropdownLinks(action.subActions)}
                  sx={{ width }}
                  key={index}
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  color={(action.type as ActionType) ?? undefined}
                >
                  {action.label}
                </DropdownButton>
              );
            } else {
              return (
                <Button
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  color={(action.type as ActionType) ?? undefined}
                  href={action.link ?? undefined}
                  sx={{ width, textWrap: "nowrap" }}
                  key={index}
                  onClick={() => {
                    logEvent(action.analytics?.description ?? "");
                  }}
                >
                  {action.label}
                </Button>
              );
            }
          })}
        </Grid>
      </Grid>
    );
  }, [data.actions, data.title, isMobile, theme]);

  const alerts = useMemo(() => {
    if (!data.alerts || data.alerts.length === 0) return null;
    return (
      <Grid container direction="column" gap={3} width={{ xs: "100%", sm: "auto" }}>
        {data.alerts.map((alert: Alert, index: number) => {
          return (
            <RacwaCardNotification
              key={index}
              severity={alert.severity as SeverityType}
              title={convertStringToElements(alert.message, { fontWeight: 400 }, data.title)}
            />
          );
        })}
      </Grid>
    );
  }, [data.alerts, data.title]);

  const policyData = useMemo(() => {
    if (!data.policyItems || data.policyItems.length === 0) return null;

    const column1 = data.policyItems.slice(0, Math.ceil(data.policyItems.length / 2));
    const column2 = data.policyItems.slice(Math.ceil(data.policyItems.length / 2));

    const policyCardTitle = data.title ?? "";

    return (
      <Stack direction={{ xs: "column", md: "row" }} useFlexGap spacing={{ xs: 2.5, md: 3 }} width="100%">
        <Stack direction="column" useFlexGap spacing={{ xs: 2.5, md: 3 }} width="100%">
          {column1.map((policyItem: PolicyItem) => {
            return (
              <PolicyItemComponent policyCardTitle={policyCardTitle} policyItem={policyItem} key={policyItem.value} />
            );
          })}
        </Stack>
        <Stack direction="column" useFlexGap spacing={{ xs: 2.5, md: 3 }} width="100%">
          {column2.map((policyItem: PolicyItem) => {
            return (
              <PolicyItemComponent policyCardTitle={policyCardTitle} policyItem={policyItem} key={policyItem.value} />
            );
          })}
        </Stack>
      </Stack>
    );
  }, [data.policyItems, data.title]);

  if (isMobile) {
    return (
      <Grid container direction="column" gap={3}>
        <Grid container direction="row" justifyContent="space-between">
          {policyHeader}
          {productIcon}
        </Grid>
        {alerts}
        {policyData}
        {actions}
      </Grid>
    );
  }

  return (
    <Grid container direction="row" width="100%" alignItems="flex-start" gap={3} flexWrap="nowrap">
      {productIcon}
      <Grid container flexGrow={1} direction="column" rowGap={3} width="auto">
        <Grid container direction="row" gap={3} flexWrap="nowrap">
          {policyHeader}
          {actions}
        </Grid>
        {alerts}
        {policyData}
      </Grid>
    </Grid>
  );
}
