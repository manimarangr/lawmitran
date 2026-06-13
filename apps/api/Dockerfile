FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
RUN npm install

FROM deps AS builder
COPY apps/api apps/api
WORKDIR /app/apps/api
RUN npx prisma generate && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY apps/api/package.json ./package.json
EXPOSE 3000
CMD ["node", "dist/main.js"]
