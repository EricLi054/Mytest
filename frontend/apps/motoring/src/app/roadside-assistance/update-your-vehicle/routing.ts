export type UpdateYourVehiclePage = {
  formPage: `/${"" | "your-vehicle" | "update-vehicle" | "confirm-vehicle" | "confirmation"}`;
  errorPage: `/${"system-unavailable" | "session-timeout" | "change-already-made" | "product-update-not-allowed"}`;
};

export const getUpdateYourVehiclePageUrl = ({ page }: { page: UpdateYourVehiclePage["formPage" | "errorPage"] }) =>
  `/roadside-assistance/update-your-vehicle${page === "/" ? "" : page}` as const;

export const getUpdateYourVehicleTimeoutUrl = ({
  previousPage,
}: {
  previousPage?: UpdateYourVehiclePage["formPage"];
}) => {
  const baseUrl = getUpdateYourVehiclePageUrl({ page: "/session-timeout" });

  // previous page used for GTM virtual page view
  if (previousPage) {
    const encodedPreviousPage = encodeURIComponent(previousPage);
    return `${baseUrl}?previousPage=${encodedPreviousPage}`;
  }

  return baseUrl;
};

export const getMyRacUrl = (racHomepage: string) => `${racHomepage}/myrac` as const;
