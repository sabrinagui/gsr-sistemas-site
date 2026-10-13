# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM dependencies AS builder
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1 GSR_IMAGE_BUILD=1
ARG NEXT_PUBLIC_SITE_URL=https://gsrsistemas.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
# Build-only values: never use production credentials to compile an image.
RUN PAYLOAD_SECRET=image-build-placeholder-not-for-runtime DATABASE_URI=postgresql://build:build@127.0.0.1:5432/build npm run generate:types
RUN PAYLOAD_SECRET=image-build-placeholder-not-for-runtime DATABASE_URI=postgresql://build:build@127.0.0.1:5432/build npm run typecheck
RUN PAYLOAD_SECRET=image-build-placeholder-not-for-runtime DATABASE_URI=postgresql://build:build@127.0.0.1:5432/build npm run build -- --webpack

FROM dependencies AS production-dependencies
RUN npm prune --omit=dev --no-audit --no-fund

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN groupadd --gid 1001 gsr && useradd --uid 1001 --gid gsr --no-create-home gsr
# The CLI also needs Payload dependencies and the source config for migrations.
COPY --from=production-dependencies --chown=gsr:gsr /app/node_modules ./node_modules
COPY --from=builder --chown=gsr:gsr /app/.next/standalone ./
COPY --from=builder --chown=gsr:gsr /app/.next/static ./.next/static
COPY --from=builder --chown=gsr:gsr /app/public ./public
COPY --from=builder --chown=gsr:gsr /app/src ./src
COPY --from=builder --chown=gsr:gsr /app/tsconfig.json ./tsconfig.json
RUN mkdir -p media .next/cache && chown -R gsr:gsr media .next/cache
USER gsr
EXPOSE 3000
CMD ["node", "server.js"]
