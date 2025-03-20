import { serverEnv } from "#env/server";
import { log, logError } from "#utils/logging";
import ensureServerSession from "#utils/session/ensureServerSession";
import { getAccessToken } from "#utils/session/getAccessToken";
import { getCrmId } from "#utils/session/getCrmId";
import { graphql } from "gql.tada";
import { z } from "zod";

import { execute } from "@racwa/gql";

const query = graphql(`
  query GetStatusInformation {
    statusInformation {
      name
      status
    }
  }
`);

export const StatusSchema = z.object({
  name: z.string(),
  status: z.enum(["HEALTHY", "RESPONDING", "DEGRADED", "DOWN", "UNABLE_TO_VERIFY"]),
});

const StatusInformationSchema = z.object({
  statusInformation: z.array(StatusSchema).nullable().optional(),
});

export const getStatusInformation = async () => {
  let crmId: string | undefined;
  const correlationId = crypto.randomUUID();
  try {
    await ensureServerSession();

    const token = await getAccessToken();

    crmId = await getCrmId();

    log("getStatusInformation", "Starting to fetching status information", correlationId, crmId);

    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      token,
      query,
      sourceSystem: "myRAC",
      variables: {},
      headers: {
        CorrelationId: correlationId,
      },
    });

    const validatedRawData = StatusInformationSchema.parse(rawData.data);
    return validatedRawData.statusInformation;
  } catch (error) {
    logError(error, "getStatusInformation", "Failed to fetch status information", correlationId, crmId);
    return null;
  }
};
