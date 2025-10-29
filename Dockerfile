# Optimized Next.js Dockerfile: 3GB -> 220MB
#
# Key optimizations:
# 1. Alpine base (node:20-alpine) instead of Bullseye - saves ~100MB
# 2. Next.js standalone output mode - bundles only required deps, not full node_modules
# 3. Multi-stage build - build artifacts only, no build-time dependencies in final image
# 4. Direct node execution (node server.js) - no yarn/npm needed in runtime
# 5. No production yarn install in runtime - standalone has everything needed
#
# Requirements:
# - next.config.ts must have: output: 'standalone'
# - Dev-only deps (pino-pretty) must be conditionally imported in production

FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATA_DIR=/data

VOLUME ["/data"]
EXPOSE 3000

USER nextjs
CMD ["node", "server.js"]
