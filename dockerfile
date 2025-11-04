# Build stage
FROM node:20 AS builder
WORKDIR /usr/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-slim
WORKDIR /usr/app

# Copiar solo lo necesario
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/app/dist ./dist

# Comando de ejecución
CMD ["node", "dist/server.js"]