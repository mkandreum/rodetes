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
# Use the workspace script
RUN npm run build -w frontend

# Stage 3: Build Backend
FROM base AS backend-builder
WORKDIR /app
COPY backend ./backend
# Use the workspace script
RUN npm run build -w backend
# Copy schema manually as it might not be part of tsc build
RUN mkdir -p backend/dist/db && cp backend/src/db/schema.sql backend/dist/db/

# Stage 4: Final Production Image
FROM node:20-alpine
WORKDIR /app

# Copy workspace definitions needed for production install
COPY package*.json ./
COPY packages ./packages
COPY backend/package*.json ./backend/

# Install ONLY production dependencies for backend and shared types
# validating that shared types are available for the backend runtime
RUN npm ci --omit=dev --workspace=backend --workspace=packages/shared

# Copy built backend artifacts
COPY --from=backend-builder /app/backend/dist ./dist

# Copy built frontend static files to public directory
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 3000
# Node runs from /app, so path is dist/server.js
CMD ["node", "dist/server.js"]
