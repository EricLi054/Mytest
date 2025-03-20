// Implements functionality related to maintaining the connection to Redis,
// including Microsoft Entra authentication.

import type { AccessToken } from "@azure/identity";
import { DefaultAzureCredential } from "@azure/identity";
import { createClient } from "redis";

import { log } from "./util";

type RedisClientType = ReturnType<typeof createClient>;

export async function createRedisClient(redisHost: string): Promise<RedisClientType> {
  const client = createClient({
    socket: {
      host: redisHost,
      port: 6380,
      tls: true,
    },
    pingInterval: 30000,
  });
  client.on("error", (err) => {
    // Errors *must* be handled, or else the auto-reconnection logic, which is
    // built-in to node-redis, does not trigger.
    log(`A Redis error occurred [${err instanceof Error ? err.message : err}]`);
  });

  await client.connect();

  // Client is unauthenticated initially.
  const clientAuthCallback = async (token: AccessToken) => {
    await client.auth({
      username: getRedisUsernameFromToken(token),
      password: getRedisPasswordFromToken(token),
    });
  };

  await createAccessTokenWithRefresh(clientAuthCallback);

  return client;
}

async function createAccessTokenWithRefresh(callback: (token: AccessToken) => Promise<void>): Promise<void> {
  const credential = new DefaultAzureCredential();
  const redisScope = "https://redis.azure.com/.default";

  const updateTokenAndNotify = async () => {
    const token = await credential.getToken(redisScope);
    await callback(token);

    // The acquired token will expire, so prime for a subsequent refresh.
    const gracePeriod = 5 * 60 * 1000; // 5 minutes
    const refreshTime = token.expiresOnTimestamp - gracePeriod;

    setTimeout(() => void updateTokenAndNotify(), refreshTime - Date.now());
  };

  await updateTokenAndNotify();
}

function getRedisUsernameFromToken(accessToken: AccessToken): string {
  // JWTs always have the same structure, separated by dots.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const base64Metadata = accessToken.token.split(".")[1]!;
  // Similarly, `oid` is specified to exist on the token claims, in
  // https://learn.microsoft.com/en-us/entra/identity-platform/access-token-claims-reference
  const { oid } = JSON.parse(Buffer.from(base64Metadata, "base64").toString("utf8")) as { oid: string };
  return oid;
}

function getRedisPasswordFromToken(accessToken: AccessToken): string {
  return accessToken.token;
}
