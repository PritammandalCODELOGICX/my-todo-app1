# Stage 1 — dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

# Stage 2 — runtime
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache curl
RUN addgroup -S app && adduser -S app -G app
COPY --from=deps /app/node_modules ./node_modules
COPY src/ ./src/
COPY package.json ./
RUN chown -R app:app /app
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
CMD ["node", "src/index.js"]