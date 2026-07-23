# Shared multi-stage Dockerfile for every NestJS service in apps/services/*.
# Build from the repo root with the service selected via build args:
#
#   docker build -f infra/services.Dockerfile \
#     --build-arg SERVICE_NAME=@growblic/submissions-service \
#     --build-arg SERVICE_DIR=apps/services/submissions-service \
#     -t growblic/submissions-service .

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-slim AS build

ARG SERVICE_NAME
ARG SERVICE_DIR

# Dummy connection strings so the postinstall prisma generate can run.
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres \
    DIRECT_URL=postgresql://postgres:postgres@localhost:5432/postgres \
    CI=true

RUN corepack enable

WORKDIR /repo
COPY . .

RUN pnpm install --frozen-lockfile

# Builds the service and, via NX task graph, every workspace package it needs.
RUN pnpm exec nx run ${SERVICE_NAME}:build

# Produce a pruned production bundle: the service package, its built dist,
# and production node_modules including the workspace packages' dist output.
RUN pnpm --filter ${SERVICE_NAME} deploy --prod /out

FROM node:${NODE_VERSION}-slim AS runtime

ENV NODE_ENV=production

WORKDIR /app
COPY --from=build /out .

# Every service serves GET /health/live on its BACKEND_PORT.
CMD ["node", "dist/main.js"]
