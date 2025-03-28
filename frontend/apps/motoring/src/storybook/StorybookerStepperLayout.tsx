import type { UpdateYourVehicleFormPage } from "#app/roadside-assistance/update-your-vehicle/routing";
import type { ReactNode } from "react";
import { EMPTY_URL } from "#constants";

import { RacwaStepperTemplate } from "@racwa/react-components";

type PagePath = {
  area: "roadside-assistance";
} & (
  | { flow: "/update-your-vehicle"; page: UpdateYourVehicleFormPage }
  | { flow: "/digital-roadside-assitance"; page: never } // TODO: update with DRA work
);

export type StorybookStepperLayoutProps = {
  pagePath: PagePath;
  children: ReactNode;
};

export default function StorybookStepperLayout({ pagePath, children }: StorybookStepperLayoutProps) {
  return (
    <div style={{ height: "100dvh" }}>
      <RacwaStepperTemplate
        breadcrumbs={{ links: [{ name: "motoring", href: EMPTY_URL }], currentPage: { name: pagePath.area } }}
        sidebarTitle={pagePath.flow}
        contentTitle={pagePath.page}
      >
        {children}
      </RacwaStepperTemplate>
      ;
    </div>
  );
}
