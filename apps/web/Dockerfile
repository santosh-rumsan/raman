FROM  --platform=linux/amd64 node:23-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.1.2 --activate
# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune web --docker --out-dir=./output


FROM base AS installer
WORKDIR /app
COPY --from=builder /app/output/full .
COPY ./apps/web/.env ./apps/web/.env
RUN pnpm install

# ARG NEXT_PUBLIC_SERVER_URL
# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm turbo build --filter=web

#clean up
# RUN rm -rf ./packages
# RUN mkdir apps/web1
# COPY ./apps/web/.next ./apps/web1/.next
# COPY ./apps/web/node_modules ./apps/web1/node_modules
# COPY ./apps/web/package.json ./apps/web1/package.json
# COPY ./apps/web/public ./apps/web1/public
# RUN rm -rf ./apps/web
# RUN mv ./apps/web1 ./apps/web

# CMD ["pnpm", "--filter=web", "start"]


# # Add lockfile and package.json's of isolated subworkspace
# FROM base AS installer
# RUN apk add --no-cache libc6-compat
# RUN apk update
# WORKDIR /app

# # First install the dependencies (as they change less often)
# COPY .gitignore .gitignore
# COPY --from=builder /app/out/json/ .

# RUN pnpm install

# # Build the project
# COPY --from=builder /app/out/full/ .
# COPY turbo.json turbo.json

# RUN pnpm turbo build --filter=web

# CMD ["pnpm", "--filter=web" "start"]

FROM base AS runner
# RUN corepack enable && corepack prepare pnpm@10.6.1 --activate
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer --chown=nextjs:nodejs /app .
CMD ["pnpm", "--filter=web", "start"]

# CMD ["tail", "-f", "/dev/null"]