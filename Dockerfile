FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY src ./src
COPY .env.example ./.env.example
COPY .env.production.example ./.env.production.example
COPY docs ./docs

RUN chown -R node:node /app

ENV NODE_ENV=production
EXPOSE 5000
USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/server.js"]
