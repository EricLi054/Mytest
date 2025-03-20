# BASE IMAGE ------------------------------------------------------------------
FROM node:22-alpine@sha256:9bef0ef1e268f60627da9ba7d7605e8831d5b56ad07487d24d1aa386336d1944 AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NEXT_TELEMETRY_DISABLED=1
ENV TURBO_TELEMETRY_DISABLED=1

RUN apk update && apk add --no-cache libc6-compat
RUN npm i -g pnpm

# BUILDER ---------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY .npmrc ./
RUN pnpm add -g turbo --save-exact
RUN rm -f .npmrc

COPY . ./
RUN turbo prune @racwa/myrac --docker

# INSTALLER -------------------------------------------------------------------
FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ ./
COPY .npmrc ./

RUN pnpm install --frozen-lockfile
RUN rm -f .npmrc

ENV NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dltdv24vg

COPY --from=builder /app/out/full/ ./
RUN SKIP_ENV_VALIDATION=1 pnpm build
RUN pnpm prune --prod

# RUNNER ----------------------------------------------------------------------
FROM node:22-alpine@sha256:9bef0ef1e268f60627da9ba7d7605e8831d5b56ad07487d24d1aa386336d1944 AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app/frontend/apps/myrac/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/frontend/apps/myrac/.next/static/chunks ./frontend/apps/myrac/.next/static/chunks

COPY frontend/apps/myrac/.env ./frontend/apps/myrac
COPY frontend/apps/myrac/.env.dev ./frontend/apps/myrac
COPY frontend/apps/myrac/.env.sit ./frontend/apps/myrac
COPY frontend/apps/myrac/.env.uat ./frontend/apps/myrac
COPY frontend/apps/myrac/.env.prd ./frontend/apps/myrac

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "frontend/apps/myrac/server.js"]
