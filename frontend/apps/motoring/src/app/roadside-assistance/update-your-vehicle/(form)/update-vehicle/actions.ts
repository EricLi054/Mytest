"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { trace } from "@opentelemetry/api";
import { getVehicleCardInfo } from "#utils/getVehicleCardInfo";

import { getUpdateYourVehiclePageUrl } from "../../routing";
import { getUpdateYourVehicleSession, setUpdateYourVehicleSession } from "../../session";
import { getVehicleDetailsByRego } from "./data";
import { UpdateVehicleFormSchema } from "./schema";

const currentPage = "/update-vehicle";

export async function updateVehicle(_: unknown, formData: FormData) {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("update-vehicle-form-submit-span");

  const submission = parseWithZod(formData, {
    schema: UpdateVehicleFormSchema,
  });

  if (submission.status !== "success") {
    span.end();
    return submission.reply();
  }

  const { session } = await getUpdateYourVehicleSession({ currentPage });

  if (!session.searchedVehicleDetails) {
    span.end();
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  session.steps.updateVehicle = submission.value;

  await setUpdateYourVehicleSession({ session, currentPage });

  span.end();
  redirect(getUpdateYourVehiclePageUrl({ page: "/confirm-vehicle" }));
}

type GetVehicleByRegoArgs = Omit<Parameters<typeof getVehicleDetailsByRego>[0]["vehicleByRego"], "state">;

export async function getVehicleByRego({ vehicleType, registrationNumber }: GetVehicleByRegoArgs) {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("update-vehicle-get-vehicle-by-rego-span");

  const { data, errors } = await getVehicleDetailsByRego({
    vehicleByRego: { vehicleType, registrationNumber, state: "WA" },
  });

  if (errors) {
    span.end();
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  if (!data.vehicleByRego) {
    span.end();
    return undefined;
  }

  const { session } = await getUpdateYourVehicleSession({ currentPage });

  session.searchedVehicleDetails = { ...data.vehicleByRego, vehicleType };

  await setUpdateYourVehicleSession({ session, currentPage });

  const vehicleCardInfo = getVehicleCardInfo(session.searchedVehicleDetails);

  if (!vehicleCardInfo.success) {
    span.end();
    return redirect(getUpdateYourVehiclePageUrl({ page: "/system-unavailable" }));
  }

  span.end();
  return vehicleCardInfo;
}

export type UpdateVehicleAction = typeof updateVehicle;
export type GetVehicleByRegoAction = typeof getVehicleByRego;
