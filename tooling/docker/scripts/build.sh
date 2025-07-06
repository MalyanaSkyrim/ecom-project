#!/bin/bash

# Check if we should skip loading environment variables
if [ "$SKIP_ENV_LOADING" != "true" ]; then
  # load environment variables
  source ./docker/env.sh
else
  echo "Skipping environment loading (SKIP_ENV_LOADING=true)"
fi

echo "Building $1..."
echo "Current directory: $(pwd)"

# Build Docker image with the modified .dockerignore
docker buildx build \
  --platform=linux/amd64 \
  --build-arg TURBO_TOKEN="$TURBO_TOKEN" \
  --build-arg TURBO_TEAM="$TURBO_TEAM" \
  --tag ecom-"$1":latest \
  --progress plain \
  --file apps/"$1"/Dockerfile \
  .

# Restore original .dockerignore
git checkout -- .dockerignore
