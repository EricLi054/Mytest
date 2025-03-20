import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { mockReadonlyRequestCookies } from "#testing/next";
import { mockTracer } from "#testing/otel";
import { getCrmId } from "#utils/getCrmId";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CanUpdateVehicleReason, RoadsideProductLine } from "../types";
import type { CreateSessionArgs } from "./actions";
import { createUpdateYourVehicleSession, uyvSessionIdCookieName } from ".";
import { createSession, deleteSessionCookie } from "./actions";
import { getRoadsideProductData } from "./data";

vi.mock("next/headers");
vi.mock("next/navigation");
vi.mock("#utils/getCrmId");
vi.mock("./data");
vi.mock(".");

vi.mock("server-only", () => ({}));

vi.mock("@opentelemetry/api", () => ({
  trace: { getTracer: mockTracer },
}));

const mockGetRoadsideProductDataResponse = ({
  isActive,
  productType,
  canUpdateVehicle,
  canUpdateVehicleReason,
  serviceIsAlive,
}: Partial<{
  isActive: boolean;
  productType: RoadsideProductLine["productType"];
  canUpdateVehicle: boolean;
  canUpdateVehicleReason: CanUpdateVehicleReason | null;
  serviceIsAlive: { personService: boolean; vehicleService: boolean };
}> = {}) =>
  ({
    data: {
      me: {
        firstName: "Anurag",
        roadsideProduct: {
          isActive: isActive ?? true,
          line: {
            productType: productType ?? "CLASSIC",
            canUpdateVehicle: canUpdateVehicle ?? true,
            canUpdateVehicleReason: canUpdateVehicleReason ?? null,
            vehicleDetail: {
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
            },
          },
        },
      },
      serviceIsAlive: serviceIsAlive ?? { vehicleService: true, personService: true },
    },
  }) as const satisfies Awaited<ReturnType<typeof getRoadsideProductData>>;

const defaultArgs = {
  productHoldingHeaderId: "PHH ID",
  productHoldingLineId: "PHL ID",
} as const satisfies CreateSessionArgs;

describe("createSession", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should delete existing session cookie, and return /system-unavailable when productHoldingHeaderId is missing", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);

    const nextPage = await createSession({ ...defaultArgs, productHoldingHeaderId: undefined });

    expect(nextPage).toBe("/system-unavailable");
    expect(mockRequestCookies.delete).toHaveBeenCalledTimes(1);
    expect(mockRequestCookies.delete).toHaveBeenCalledWith(uyvSessionIdCookieName);
    expect(createUpdateYourVehicleSession).not.toHaveBeenCalled();
    expect(mockRequestCookies.set).not.toHaveBeenCalled();
  });

  it("should delete existing session cookie, and return /system-unavailable when productHoldingLineId is missing", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);

    const nextPage = await createSession({ ...defaultArgs, productHoldingLineId: undefined });

    expect(nextPage).toBe("/system-unavailable");
    expect(mockRequestCookies.delete).toHaveBeenCalledTimes(1);
    expect(mockRequestCookies.delete).toHaveBeenCalledWith(uyvSessionIdCookieName);
    expect(createUpdateYourVehicleSession).not.toHaveBeenCalled();
    expect(mockRequestCookies.set).not.toHaveBeenCalled();
  });

  it("should return /system-unavailable when there is no CRM ID", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
    vi.mocked(getCrmId).mockReturnValue(Promise.resolve(undefined));

    const nextPage = await createSession(defaultArgs);

    expect(nextPage).toBe("/system-unavailable");
  });

  it("should return /system-unavailable when there are errors querying roadside product data", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
    vi.mocked(getCrmId).mockReturnValue(Promise.resolve("CRM ID"));
    vi.mocked(getRoadsideProductData).mockReturnValue(
      Promise.resolve({
        data: { me: null, serviceIsAlive: { personService: true, vehicleService: true } },
        errors: [
          {
            name: "GraphQLError",
            message: "GraphQL error occurred",
            locations: [{ line: 1, column: 2 }],
            path: ["me", "productHoldingHeader"],
          },
        ],
      }),
    );

    const nextPage = await createSession(defaultArgs);

    expect(nextPage).toBe("/system-unavailable");
  });

  it("should return /system-unavailable when personService is not alive", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
    vi.mocked(getCrmId).mockReturnValue(Promise.resolve("CRM ID"));
    vi.mocked(getRoadsideProductData).mockReturnValue(
      Promise.resolve(
        mockGetRoadsideProductDataResponse({
          isActive: true,
          canUpdateVehicle: true,
          canUpdateVehicleReason: null,
          serviceIsAlive: { personService: false, vehicleService: true },
        }),
      ),
    );

    const nextPage = await createSession(defaultArgs);

    expect(nextPage).toBe("/system-unavailable");
  });

  it("should return /system-unavailable when vehicleService is not alive", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
    vi.mocked(getCrmId).mockReturnValue(Promise.resolve("CRM ID"));
    vi.mocked(getRoadsideProductData).mockReturnValue(
      Promise.resolve(
        mockGetRoadsideProductDataResponse({
          isActive: true,
          canUpdateVehicle: true,
          canUpdateVehicleReason: null,
          serviceIsAlive: { personService: true, vehicleService: false },
        }),
      ),
    );

    const nextPage = await createSession(defaultArgs);

    expect(nextPage).toBe("/system-unavailable");
  });

  it("should return /system-unavailable when there is no member data", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    const mockSessionId = crypto.randomUUID();
    const mockCrmId = crypto.randomUUID();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
    vi.mocked(createUpdateYourVehicleSession).mockReturnValue(
      Promise.resolve({ success: true, sessionId: mockSessionId }),
    );
    vi.mocked(getCrmId).mockReturnValue(Promise.resolve(mockCrmId));
    vi.mocked(getRoadsideProductData).mockReturnValue(
      Promise.resolve({ data: { me: null, serviceIsAlive: { personService: true, vehicleService: true } } }),
    );

    const nextPage = await createSession(defaultArgs);

    expect(nextPage).toBe("/system-unavailable");
  });

  it("should return /system-unavailable when there is no roadside product", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    const mockSessionId = crypto.randomUUID();
    const mockCrmId = crypto.randomUUID();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
    vi.mocked(createUpdateYourVehicleSession).mockReturnValue(
      Promise.resolve({ success: true, sessionId: mockSessionId }),
    );
    vi.mocked(getCrmId).mockReturnValue(Promise.resolve(mockCrmId));
    vi.mocked(getRoadsideProductData).mockReturnValue(
      Promise.resolve({
        data: {
          me: { firstName: "Anurag", roadsideProduct: null },
          serviceIsAlive: { personService: true, vehicleService: true },
        },
      }),
    );

    const nextPage = await createSession(defaultArgs);

    expect(nextPage).toBe("/system-unavailable");
  });

  it("should return /system-unavailable when roadside product is not active", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    const mockSessionId = crypto.randomUUID();
    const mockCrmId = crypto.randomUUID();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
    vi.mocked(createUpdateYourVehicleSession).mockReturnValue(
      Promise.resolve({ success: true, sessionId: mockSessionId }),
    );
    vi.mocked(getCrmId).mockReturnValue(Promise.resolve(mockCrmId));
    vi.mocked(getRoadsideProductData).mockReturnValue(
      Promise.resolve(mockGetRoadsideProductDataResponse({ isActive: false })),
    );

    const nextPage = await createSession(defaultArgs);

    expect(nextPage).toBe("/system-unavailable");
  });

  it("should return /system-unavailable when there is no roadside product line", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    const mockSessionId = crypto.randomUUID();
    const mockCrmId = crypto.randomUUID();
    const {
      data: {
        me: { firstName, roadsideProduct },
      },
    } = mockGetRoadsideProductDataResponse();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
    vi.mocked(createUpdateYourVehicleSession).mockReturnValue(
      Promise.resolve({ success: true, sessionId: mockSessionId }),
    );
    vi.mocked(getCrmId).mockReturnValue(Promise.resolve(mockCrmId));
    vi.mocked(getRoadsideProductData).mockReturnValue(
      Promise.resolve({
        data: {
          me: {
            firstName,
            roadsideProduct: { ...roadsideProduct, line: null },
          },
          serviceIsAlive: { personService: true, vehicleService: true },
        },
      }),
    );

    const nextPage = await createSession(defaultArgs);

    expect(nextPage).toBe("/system-unavailable");
  });

  it("should return /change-already-made when canUpdateVehicle is false and reason is VEHICLE_CHANGE_LIMIT_REACHED", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
    vi.mocked(getCrmId).mockReturnValue(Promise.resolve("CRM ID"));
    vi.mocked(getRoadsideProductData).mockReturnValue(
      Promise.resolve(
        mockGetRoadsideProductDataResponse({
          isActive: true,
          canUpdateVehicle: false,
          canUpdateVehicleReason: "VEHICLE_CHANGE_LIMIT_REACHED",
        }),
      ),
    );

    const nextPage = await createSession(defaultArgs);

    expect(nextPage).toBe("/change-already-made");
  });

  it("should return /product-update-not-allowed when canUpdateVehicle is false and reason is REGO_ONLY_CHANGE_ALLOWED", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
    vi.mocked(getCrmId).mockReturnValue(Promise.resolve("CRM ID"));
    vi.mocked(getRoadsideProductData).mockReturnValue(
      Promise.resolve(
        mockGetRoadsideProductDataResponse({
          isActive: true,
          canUpdateVehicle: false,
          canUpdateVehicleReason: "REGO_ONLY_CHANGE_ALLOWED",
        }),
      ),
    );

    const nextPage = await createSession(defaultArgs);

    expect(nextPage).toBe("/product-update-not-allowed");
  });

  it("should return /product-update-not-allowed when canUpdateVehicle is false, reason is PRODUCT_NOT_ENABLED and roadside product line type is not OTHER", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
    vi.mocked(getCrmId).mockReturnValue(Promise.resolve("CRM ID"));
    vi.mocked(getRoadsideProductData).mockReturnValue(
      Promise.resolve(
        mockGetRoadsideProductDataResponse({
          isActive: true,
          productType: "WHEELS2_GO",
          canUpdateVehicle: false,
          canUpdateVehicleReason: "PRODUCT_NOT_ENABLED",
        }),
      ),
    );

    const nextPage = await createSession(defaultArgs);

    expect(nextPage).toBe("/product-update-not-allowed");
  });

  it("should return /system-unavailable when canUpdateVehicle is false, reason is PRODUCT_NOT_ENABLED and roadside product line type is OTHER", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
    vi.mocked(getCrmId).mockReturnValue(Promise.resolve("CRM ID"));
    vi.mocked(getRoadsideProductData).mockReturnValue(
      Promise.resolve(
        mockGetRoadsideProductDataResponse({
          isActive: true,
          productType: "OTHER",
          canUpdateVehicle: false,
          canUpdateVehicleReason: "PRODUCT_NOT_ENABLED",
        }),
      ),
    );

    const nextPage = await createSession(defaultArgs);

    expect(nextPage).toBe("/system-unavailable");
  });

  it("should return /system-unavailable when canUpdateVehicle is false and reason is null", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
    vi.mocked(getCrmId).mockReturnValue(Promise.resolve("CRM ID"));
    vi.mocked(getRoadsideProductData).mockReturnValue(
      Promise.resolve(
        mockGetRoadsideProductDataResponse({
          isActive: true,
          canUpdateVehicle: false,
          canUpdateVehicleReason: null,
        }),
      ),
    );

    const nextPage = await createSession(defaultArgs);

    expect(nextPage).toBe("/system-unavailable");
  });

  it("should return /system-unavailable when product holding line is missing vehicle details", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    const mockSessionId = crypto.randomUUID();
    const mockCrmId = crypto.randomUUID();
    const {
      data: {
        me: { firstName, roadsideProduct },
      },
    } = mockGetRoadsideProductDataResponse();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
    vi.mocked(createUpdateYourVehicleSession).mockReturnValue(
      Promise.resolve({ success: true, sessionId: mockSessionId }),
    );
    vi.mocked(getCrmId).mockReturnValue(Promise.resolve(mockCrmId));
    vi.mocked(getRoadsideProductData).mockReturnValue(
      Promise.resolve({
        data: {
          me: {
            firstName,
            roadsideProduct: {
              ...roadsideProduct,
              line: {
                ...roadsideProduct.line,
                vehicleDetail: null,
              },
            },
          },
          serviceIsAlive: { personService: true, vehicleService: true },
        },
      }),
    );

    const nextPage = await createSession(defaultArgs);

    expect(nextPage).toBe("/system-unavailable");
  });

  it("should return /system-unavailable when creating a session fails", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    const mockCrmId = crypto.randomUUID();
    const mockRoadsideProductData = mockGetRoadsideProductDataResponse();

    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
    vi.mocked(createUpdateYourVehicleSession).mockReturnValue(Promise.resolve({ success: false }));
    vi.mocked(getCrmId).mockReturnValue(Promise.resolve(mockCrmId));
    vi.mocked(getRoadsideProductData).mockReturnValue(Promise.resolve(mockRoadsideProductData));

    const nextPage = await createSession(defaultArgs);

    expect(nextPage).toBe("/system-unavailable");
  });

  it("should delete existing session cookie, create a new session, set the session ID cookie and return /your-vehicle", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    const mockSessionId = crypto.randomUUID();
    const mockCrmId = crypto.randomUUID();
    const mockRoadsideProductData = mockGetRoadsideProductDataResponse();

    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);
    vi.mocked(createUpdateYourVehicleSession).mockReturnValue(
      Promise.resolve({ success: true, sessionId: mockSessionId }),
    );
    vi.mocked(getCrmId).mockReturnValue(Promise.resolve(mockCrmId));
    vi.mocked(getRoadsideProductData).mockReturnValue(Promise.resolve(mockRoadsideProductData));

    const nextPage = await createSession(defaultArgs);

    expect(nextPage).toBe("/your-vehicle");
    expect(mockRequestCookies.delete).toHaveBeenCalledTimes(1);
    expect(mockRequestCookies.delete).toHaveBeenCalledWith(uyvSessionIdCookieName);
    expect(createUpdateYourVehicleSession).toHaveBeenCalledTimes(1);
    expect(createUpdateYourVehicleSession).toHaveBeenCalledWith<Parameters<typeof createUpdateYourVehicleSession>>({
      firstName: mockRoadsideProductData.data.me.firstName,
      productHoldingHeaderId: defaultArgs.productHoldingHeaderId,
      productHoldingLineId: defaultArgs.productHoldingLineId,
      currentVehicleDetails: mockRoadsideProductData.data.me.roadsideProduct.line.vehicleDetail,
    });
    expect(mockRequestCookies.set).toHaveBeenCalledTimes(1);
    expect(mockRequestCookies.set).toHaveBeenCalledWith<Parameters<ReadonlyRequestCookies["set"]>>(
      uyvSessionIdCookieName,
      mockSessionId,
      {
        secure: true,
        httpOnly: true,
        sameSite: "strict",
      },
    );
  });
});

describe("deleteSessionCookie", () => {
  it("should delete the UpdateYourVehicle sessionId cookie", async () => {
    const mockRequestCookies = mockReadonlyRequestCookies();
    vi.mocked(cookies).mockResolvedValue(mockRequestCookies);

    await deleteSessionCookie();

    expect(mockRequestCookies.delete).toHaveBeenCalledTimes(1);
    expect(mockRequestCookies.delete).toHaveBeenCalledWith(uyvSessionIdCookieName);
  });
});
