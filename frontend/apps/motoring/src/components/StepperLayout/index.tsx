"use client";

import React, { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Box } from "@mui/material";
import { getMyRacUrl } from "#app/roadside-assistance/update-your-vehicle/routing";
import { logEvent } from "#utils/analyticsTagging";

import type { FooterProps, RacwaBreadcrumbDetails } from "@racwa/react-components";
import { RacwaStepperTemplate } from "@racwa/react-components";

import EntitlementsLink from "./EntitlementsLink";

type Step = {
  name: string;
  path: string;
};

const getActiveStepIndex = (steps: Step[], pathname: string): number => {
  return steps.findIndex((step) => step.path === pathname);
};

const getBreadcrumbs = (myRacUrl: string): RacwaBreadcrumbDetails => {
  return {
    links: [{ name: "myRAC", href: myRacUrl, key: "my-rac" }],
    currentPage: {
      key: "update-your-vehicle",
      name: "Update your vehicle",
    },
  };
};

const steps = [
  { name: "Your Vehicle", path: "/roadside-assistance/update-your-vehicle/your-vehicle" },
  { name: "Update Vehicle", path: "/roadside-assistance/update-your-vehicle/update-vehicle" },
  { name: "Confirm Vehicle", path: "/roadside-assistance/update-your-vehicle/confirm-vehicle" },
  { name: "Confirmation", path: "/roadside-assistance/update-your-vehicle/confirmation" },
] satisfies Step[];

const SidebarContent = ({ entitlementsUrl }: { entitlementsUrl: string }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <EntitlementsLink url={entitlementsUrl} onClick={() => logEvent("Roadside Assistance Entitlements")} />
    </Box>
  );
};

export type StepperLayoutProps = React.PropsWithChildren<{
  racHomepageUrl: string;
  entitlementsUrl: string;
  footerProps?: FooterProps;
}>;

export default function StepperLayout({ racHomepageUrl, entitlementsUrl, footerProps, children }: StepperLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const activeStepIndex = useMemo(() => getActiveStepIndex(steps, pathname), [pathname]);
  const breadcrumbs = useMemo(() => getBreadcrumbs(getMyRacUrl(racHomepageUrl)), [racHomepageUrl]);

  const isConfirmationPage = pathname === "/roadside-assistance/update-your-vehicle/confirmation";

  const handleStepClick = (index: number) => {
    const path = steps[`${index}`]?.path;
    if (path && !isConfirmationPage) {
      router.push(path);
    }
  };

  const handleClickBack = () => {
    if (activeStepIndex === 0) {
      return router.push(getMyRacUrl(racHomepageUrl));
    }
    handleStepClick(activeStepIndex - 1);
  };

  return (
    <RacwaStepperTemplate
      showHeader
      responsiveHeaderProps={{ NavBreadcrumbsProps: { homeLink: racHomepageUrl } }}
      breadcrumbs={breadcrumbs}
      headerEndAction={<></>}
      sidebarTitle="Update Your Vehicle"
      steps={steps.map((step) => ({ name: step.name }))}
      activeStepIndex={activeStepIndex}
      onStepClick={(_, index) => handleStepClick(index)}
      sidebarContent={<SidebarContent entitlementsUrl={entitlementsUrl} />}
      mobileStepperProps={{ hideBack: isConfirmationPage, onClickBack: handleClickBack }}
      footerProps={footerProps}
    >
      {children}
    </RacwaStepperTemplate>
  );
}
