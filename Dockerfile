# Multi-stage Dockerfile for unified Rodetes App
# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN npm run build
# Copy schema.sql to dist
RUN mkdir -p dist/db && cp src/db/schema.sql dist/db/

# Stage 3: Final Production Image
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend
COPY --from=backend-builder /app/backend/dist ./dist
# Copy frontend static files to backend public dir
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 3000
CMD ["node", "dist/server.js"]
