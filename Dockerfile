# Multi-stage Dockerfile for unified Rodetes App
# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/web
COPY web/package*.json ./
RUN npm ci
COPY web ./
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src ./src
COPY tsconfig.json ./
RUN npm run build:backend
# Copy schema.sql to dist
RUN mkdir -p dist/db && cp src/db/schema.sql dist/db/

# Stage 3: Final Production Image
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Copy backend
COPY --from=backend-builder /app/dist ./dist
# Copy frontend static files to backend public dir
COPY --from=frontend-builder /app/web/dist ./public

EXPOSE 3000
CMD ["node", "dist/server.js"]
