export type UpdateYourVehiclePreFormPage = "/";

export type UpdateYourVehicleFormPage = `/${"your-vehicle" | "update-vehicle" | "confirm-vehicle" | "confirmation"}`;

export type UpdateYourVehicleErrorPage =
  `/${"system-unavailable" | "session-timeout" | "change-already-made" | "product-update-not-allowed"}`;

export type UpdateYourVehiclePage =
  | UpdateYourVehiclePreFormPage
  | UpdateYourVehicleFormPage
  | UpdateYourVehicleErrorPage;

export const getUpdateYourVehiclePageUrl = ({ page }: { page: UpdateYourVehiclePage }) =>
  `/roadside-assistance/update-your-vehicle${page === "/" ? "" : page}` as const;

export const getUpdateYourVehicleTimeoutUrl = ({ previousPage }: { previousPage?: UpdateYourVehicleFormPage }) => {
  const baseUrl = getUpdateYourVehiclePageUrl({ page: "/session-timeout" });

  // previous page used for GTM virtual page view
  if (previousPage) {
    const encodedPreviousPage = encodeURIComponent(previousPage);
    return `${baseUrl}?previousPage=${encodedPreviousPage}`;
  }

  return baseUrl;
};

export const getMyRacUrl = (racHomepage: string) => `${racHomepage}/myrac` as const;
