# Stage 1: Base (Install dependencies)
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY packages ./packages
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
RUN npm ci

# Stage 2: Build Frontend
FROM base AS frontend-builder
WORKDIR /app
COPY frontend ./frontend
# Build shared first
RUN npm run build -w packages/shared
RUN npm run build -w frontend

# Stage 3: Build Backend
FROM base AS backend-builder
WORKDIR /app
COPY backend ./backend
# Build shared first
RUN npm run build -w packages/shared
RUN npm run build -w backend
RUN mkdir -p backend/dist/db && cp backend/src/db/schema.sql backend/dist/db/

# Stage 4: Final Production Image
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY packages ./packages
COPY backend/package*.json ./backend/

# Install production dependencies
RUN npm ci --omit=dev --workspace=backend --workspace=packages/shared

# Copy built artifacts
COPY --from=backend-builder /app/backend/dist ./dist
# We also need the built shared package in dist? 
# Usually 'npm ci' links it, and since it's in ./packages/shared/src (ts-node) or dist (compiled), 
# If backend uses ts-node or dist depends on configuration.
# But for production 'node dist/server.js', it imports from node_modules.
# If node_modules link to packages/shared, we need packages/shared to contain built files?
# Yes, if 'main' points to dist. 
# So we should copy valid shared artifacts or just rely on the install if it's source-based.
# Since we updated 'exports' to './src/index.ts', it refers to source. 
# But node cannot run TS directly without loader. 
# So backend production likely needs compiled shared types OR backend compiles them into its own dist.
# TypeScript usually compiles imported code into the output if it's included.
# Let's assume standard behavior.

COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 3000
CMD ["node", "dist/server.js"]
