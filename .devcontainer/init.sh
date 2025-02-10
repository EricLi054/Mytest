#!/bin/bash


# Initialize dapr
dapr uninstall
# update runtime version to azure container environment's
dapr init --runtime-version 1.12.5

# Setup npmrc for private registry, don't overwrite if already exists
# follow 
cp -n frontend/.npmrc.sample frontend/.npmrc
# copy sample, still needs to be filled in
cp -n frontend/.env.sample frontend/.env.local
