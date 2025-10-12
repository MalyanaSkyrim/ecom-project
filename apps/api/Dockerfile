# syntax=docker/dockerfile:1

# Pin Node.js version
ARG NODE_VERSION="22.11.0"

# Pin Alpine version
ARG ALPINE_VERSION="3.20"


# Base image
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base

#######################
# Builder stage
#######################
FROM base AS builder

# libc6-compat required for Turborepo
# openssl required for Prisma
RUN apk add --no-cache libc6-compat openssl && apk update

# Set working directory
WORKDIR /app
RUN pnpm global add turbo
COPY . .
RUN turbo prune --scope=@ecom/api --docker


#######################
# Installer stage
#######################
FROM base AS installer

# libc6-compat required for Turborepo
# openssl required for Prisma
# python3, make and g++ are required for argon2 binaries compilation
RUN apk add --no-cache libc6-compat openssl python3 make g++ && apk update

WORKDIR /app

# Environment variables for building the API
ENV CI=true
ENV SKIP_ENV_VALIDATION=true

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm.lock ./pnpm.lock
RUN pnpm install --network-timeout 1000000

# Get the output from the builder stage
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Remote caching
ARG TURBO_TOKEN
ENV TURBO_TOKEN $TURBO_TOKEN
ARG TURBO_TEAM
ENV TURBO_TEAM $TURBO_TOKEN

# Build the project and its dependencies
RUN pnpm turbo run build --filter=@ecom/api...

#######################
# Runner stage
#######################
FROM base AS runner

# libc6-compat required for Turborepo
# openssl required for Prisma
RUN apk add --no-cache libc6-compat openssl && apk update

WORKDIR /app

# Get the output from the installer stage
COPY --from=installer /app .

# Don't run production as root
RUN addgroup --system --gid 1001 ecom && \
  adduser --system --uid 1001 ecom
USER ecom

CMD ["node", "apps/api/build/app.js"]
