import { z } from "zod";

import type { Result } from "@racwa/types";

import type { DynamicsEntity } from "./entities";
import { automationEnv } from "../../env/automationEnv";
import { getDynamicsAccessToken } from "./getDynamicsAccessToken";

type QueryDynamicsArgs<T extends z.AnyZodObject> = { entity: Readonly<DynamicsEntity<T>>; query: string };

const ODataQueryResponseSchema = z.object({
  value: z.array(z.unknown()),
});

const message = (message: string) => `[queryDynamics]: ${message}` as const;

export const queryDynamics = async <T extends z.AnyZodObject>({
  entity,
  query,
}: QueryDynamicsArgs<T>): Promise<Result<{ value: { entities: z.infer<T>[] }; error: ReturnType<typeof message> }>> => {
  const accessTokenResult = await getDynamicsAccessToken();

  if (!accessTokenResult.success) {
    console.log(accessTokenResult.error);
    return { success: false, error: message("Failed to get access token") };
  }

  const { accessToken } = accessTokenResult;

  try {
    const response = await fetch(`${automationEnv().DYNAMICS_URL}/api/data/v9.2/${entity.name}?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        SourceSystem: "rac-digital-test-automation",
        Accept: "application/json",
        // Prefer: 'odata.include-annotations="OData.Community.Display.V1.FormattedValue"', // Can be ussed for debugging
      },
    });

    if (!response.ok) {
      console.log(await response.json());
      return { success: false, error: message(`Query failed, status ${response.status}`) };
    }

    const parseResult = ODataQueryResponseSchema.safeParse(await response.json());

    if (!parseResult.success) {
      return { success: false, error: message(`Failed to parse response body [${parseResult.error.message}]`) };
    }

    const {
      data: { value },
    } = parseResult;

    const entities = value
      .map((e) => entity.schema.safeParse(e))
      .filter((result) => {
        if (!result.success) {
          console.log(message(`Failed to parse entity [${result.error.toString()}]`));
        }
        return result.success;
      })
      .map((result) => result.data);

    if (entities.length === 0) {
      return { success: false, error: message("No valid entities found") };
    }

    return { success: true, entities };
  } catch (e) {
    return { success: false, error: message(`Error [${e?.toString()}]`) };
  }
};
