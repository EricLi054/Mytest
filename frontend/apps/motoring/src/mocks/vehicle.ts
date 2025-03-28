import type { VehicleDetail } from "#app/roadside-assistance/update-your-vehicle/types";

export const mockVehicleDetails = (details: Partial<VehicleDetail> = {}) =>
  ({
    vehicleType: "CAR",
    registrationNumber: "1ANURAG",
    year: 2022,
    make: "Toyota",
    model: "Corolla",
    color: "Black",
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
    ...details,
  }) as const satisfies VehicleDetail;
