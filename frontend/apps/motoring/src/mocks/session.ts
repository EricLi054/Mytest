import type { UpdateYourVehicleSession } from "#app/roadside-assistance/update-your-vehicle/UpdateYourVehicleSession";

export const mockSessionIds = () =>
  ({ crmId: "mock-crm-id", sessionId: "mock-session-id" }) as const satisfies { crmId: string; sessionId: string };

export const mockUpdateYourVehicleSession = ({
  currentVehicleDetails,
  steps,
  ...session
}: Partial<
  Omit<UpdateYourVehicleSession, "currentVehicleDetails" | "steps"> & {
    [Key in keyof Pick<UpdateYourVehicleSession, "currentVehicleDetails" | "steps">]?: Partial<
      UpdateYourVehicleSession[Key]
    >;
  }
> = {}) =>
  ({
    crmId: "mock-crm-id",
    firstName: "Anurag",
    productHoldingHeaderId: "phh",
    productHoldingLineId: "phl",
    currentVehicleDetails: {
      registrationNumber: "1ANURAG",
      year: 2022,
      make: "Toyota",
      model: "Corolla",
      variant: "Sedan",
      series: "E210",
      body: "Sedan",
      height: 1435,
      length: 4630,
      width: 1780,
      kerbWeight: 1300,
      transmission: "Automatic",
      fuel: "Petrol",
      cylinder: "4",
      cc: "1798",
      co2Emission: "120",
      vin: "JTDBU4EE9B9123456",
      nvic: "1234567890",
      color: "Blue",
      vehicleType: "CAR",
      ...currentVehicleDetails,
    },
    searchedVehicleDetails: undefined,
    steps: { yourVehicle: undefined, updateVehicle: undefined, confirmVehicle: { vehicleUpdated: false }, ...steps },
    ...session,
  }) as const satisfies UpdateYourVehicleSession;
