# Multi-stage build for development and production

# Base stage with Node.js
FROM node:20-alpine as base
WORKDIR /workspace
RUN apk add --no-cache git
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base as development
RUN npm ci
COPY . .
EXPOSE 3000 24678
CMD ["npm", "run", "dev"]

# Build stage
FROM base as build
RUN npm ci
COPY . .
RUN npm run build && npm run type-check

# Production stage for serving files
FROM nginx:alpine as production
COPY --from=build /workspace/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Test stage with built files
FROM node:20-alpine as test
WORKDIR /app
COPY --from=build /workspace/dist ./dist
COPY --from=build /workspace/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "run", "preview"]