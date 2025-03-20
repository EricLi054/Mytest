"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { trace } from "@opentelemetry/api";

import { getUpdateYourVehiclePageUrl } from "../../routing";
import { getUpdateYourVehicleSession, setUpdateYourVehicleSession } from "../../session";
import { YourVehicleFormSchema } from "./schema";

const log = (message: string) => console.log(`[yourVehicle (server action)]: ${message}`);

export async function yourVehicle(_: unknown, formData: FormData) {
  const tracer = trace.getTracer("default");
  const span = tracer.startSpan("your-vehicle-form-submit-span");
  const currentPage = "/your-vehicle";

  const submission = parseWithZod(formData, {
    schema: YourVehicleFormSchema,
  });

  if (submission.status !== "success") {
    log("Form submission failed validation");
    span.end();
    return submission.reply();
  }

  const { session } = await getUpdateYourVehicleSession({ currentPage });
  session.steps.yourVehicle = submission.value;
  await setUpdateYourVehicleSession({ session, currentPage });

  log("Successfully updated session with YourVehicleForm data, redirecting to /update-vehicle");

  span.end();
  redirect(getUpdateYourVehiclePageUrl({ page: "/update-vehicle" }));
}

export type YourVehicleAction = typeof yourVehicle;
