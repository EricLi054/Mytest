# @racwa/cache

## Developer setup

When developing locally, the cache package logs into Entra ID in order
to authenticate to the Redis cache. As Azure Cache for Redis uses its own data
access configuration mechanism that doesn't support group assignment, you will
need to perform the following steps before running your app for the first time:

1. Open Azure portal and search for `next-rac-redis-dev`
2. Navigate to the "Settings > Data Access Configuration" blade
3. Click "Add > New Redis User"
4. Follow the steps to assign the "AppCache" Access Policy to your regular
   (non-PA/SA) user account
5. Wait for the provisioning state to reach "Succeeded"

Failure to do so will result in log entries containing the following being
printed when launching your app:

```
ERR WRONGPASS invalid username-password pair
```

## Integrating into a new app

As this package uses Entra ID to authenticate to Redis, you first need to make
sure your application has a managed identity assigned, and that identity has
the correct Data Access Configuration on the Redis cache you are targeting.
The existing managed identities used across the current Digital Platform apps
(`next-rac-identity-{npe,prd}`) have already been configured with this access.

The package needs some initial setup in order to function. You must ensure the
`initCaching({ redisHost, appName })` function is called somewhere in your
application before attempting to call `getCacheFor<T>({ instanceName })`.

```typescript
const { initCaching } = await import("@racwa/cache");
await initCaching({
  redisHost: process.env.REDIS_HOST ?? "", // Ensure your app populates the REDIS_HOST environment variable
  appName: "MOTORING", // Replace with a unique identifier for your application
});
```

After that, simply import and call the `getCacheFor<T>({ instanceName })`
anywhere you need to store or retrieve cached data. You are free to choose an
appropriate identifier for instance to separate data used for different
purposes within your app. A common pattern is `<FLOW NAME>:<DATA TYPE NAME>`.
This is appended to the app name and used to form the keys stored in Redis.

```typescript
import { getCacheFor } from "@racwa/cache";

const sessionCachePrefix = "UYV:SESSION";

// ...

const sessionCache = getCacheFor<UpdateYourVehicleSession>({
  instanceName: sessionCachePrefix,
});

const sessionId = crypto.randomUUID();

const createResult = await sessionCache.create({
  cacheKey: sessionId,
  data: {
    ...data,
  },
  absoluteTtlMillis,
  slidingTtlMillis,
});
```
