type UpdateYourVehiclePage = `/update-your-vehicle${
  | `?productHoldingHeaderId=${string}&productHoldingLineId=${string}`
  | `/${"your-vehicle" | "update-vehicle" | "confirm-vehicle" | "confirmation" | "system-unavailable" | "session-timeout" | "change-already-made" | "product-update-not-allowed"}`}`;

type Page = UpdateYourVehiclePage;

export const roadsideAssistanceUrl = (page: Page) => `/motoring/roadside-assistance${page}` as const;
