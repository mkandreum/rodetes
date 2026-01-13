# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
# Copy frontend deps
COPY frontend/package*.json ./
RUN npm ci
# Copy frontend source
COPY frontend/ .
# Build
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
# Copy backend deps
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
RUN npm ci
# Copy backend source
COPY backend/src ./src
# Build
RUN npm run build
# Copy schema.sql to dist (TypeScript doesn't copy .sql files)
RUN mkdir -p dist/db && cp src/db/schema.sql dist/db/

# Stage 3: Final Image
FROM node:20-alpine
WORKDIR /app

# Copy backend package.json for production deps
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy built backend
COPY --from=backend-builder /app/backend/dist ./dist

# Copy built frontend to public folder served by backend
COPY --from=frontend-builder /app/frontend/dist ./public

# Environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start
CMD ["node", "dist/server.js"]
