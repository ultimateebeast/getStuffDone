# Multi-stage Dockerfile for MERN To-Do App

# Backend
FROM node:18 AS backend
WORKDIR /app/server
COPY server/package.json ./
RUN npm install
COPY server .

# Frontend
FROM node:18 AS frontend
WORKDIR /app/client
COPY client/package.json ./
RUN npm install
COPY client .
RUN npm run build

# Production
FROM node:18 AS production
WORKDIR /app
COPY --from=backend /app/server ./server
COPY --from=frontend /app/client/build ./client/build
ENV NODE_ENV=production
WORKDIR /app/server
CMD ["node", "index.js"]
