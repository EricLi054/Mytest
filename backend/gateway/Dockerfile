FROM node:22-alpine@sha256:9bef0ef1e268f60627da9ba7d7605e8831d5b56ad07487d24d1aa386336d1944 AS base
RUN npm install -g pnpm

# BUILDER ---------------------------------------------------------------------
FROM base AS builder

RUN apk add --no-cache jq bash

WORKDIR /app
COPY .npmrc /backend/gateway/package.json pnpm-workspace.yaml ./
RUN jq 'del(.devDependencies, .scripts)' package.json > package.tmp && mv package.tmp package.json
RUN pnpm install --filter @racwa/gateway
ENV TZ=Australia/Perth

# RUNNER ----------------------------------------------------------------------
FROM base AS runner

# Required for Azure Client
RUN apk add --no-cache gnupg py3-pip gcc musl-dev python3-dev libffi-dev openssl-dev cargo make
RUN pip install --break-system-packages --upgrade pip==24.3.1 setuptools==75.6.0
RUN pip install --break-system-packages azure-cli==2.67.0
RUN az --version

WORKDIR /app
EXPOSE 4000

COPY --from=builder /app /app
COPY backend/gateway/gateway.config.ts ./
COPY backend/gateway/scripts/entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

RUN chown -R node:node /app
USER node

ENTRYPOINT ["sh", "/app/entrypoint.sh"] 