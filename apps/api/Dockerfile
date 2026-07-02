FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY apps/api/package.json apps/api/
COPY apps/api/tsconfig.json apps/api/
COPY apps/api/prisma apps/api/prisma/
COPY packages/ packages/

WORKDIR /usr/src/app/apps/api

RUN pnpm install --frozen-lockfile

COPY apps/api/src ./src
RUN pnpm prisma generate
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy built artifacts
COPY --from=builder /usr/src/app/apps/api/dist ./dist
COPY --from=builder /usr/src/app/apps/api/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/main"]