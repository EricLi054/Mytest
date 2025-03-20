#!/bin/bash

echo "[ENTRYPOINT]: Starting entrypoint script..."

set -euo pipefail

echo "[ENTRYPOINT]: Error handling set"

if [ ! -f /app/supergraph.graphql ]; then

    echo "[ENTRYPOINT]: Logging into Azure"

    az login --identity --username "${AZURE_CLIENT_ID}"
    
    echo "[ENTRYPOINT]: Downloading supergraph.graphql file from blob storage"
    
    az storage blob download --account-name "racdigitalstore${CONTAINER_APP_ENV}" --container-name supergraph-gateway --name supergraph.graphql --file /app/supergraph.graphql.base64 --auth-mode login

    echo "[ENTRYPOINT]: Decoding & decrypting supergraph.graphql file..."

    cat /app/supergraph.graphql.base64 | base64 -d > /app/supergraph.graphql.gpg
    rm /app/supergraph.graphql.base64
    
    gpg --decrypt --passphrase "${SUPERGRAPH_ENCRYPTION_KEY}" --batch --yes -o /app/supergraph.graphql /app/supergraph.graphql.gpg
    rm /app/supergraph.graphql.gpg

    echo "[ENTRYPOINT]: Successfully decoded & decrypted supergraph.graphql file"

    az logout
    az cache purge
    az account clear
fi
if [ -f /app/supergraph.graphql ]; then
    echo "[ENTRYPOINT]: Supergraph file successfully created at /app/supergraph.graphql"
else
    echo "[ENTRYPOINT]: Failed to create supergraph file" >&2
    exit 1
fi

echo "[ENTRYPOINT]: Finding hive-gateway location:"
find /app -name "hive-gateway"

echo "[ENTRYPOINT]: Starting supergraph..."

/bin/sh /app/node_modules/.bin/hive-gateway supergraph

echo "[ENTRYPOINT]: Supergraph started successfully!"
