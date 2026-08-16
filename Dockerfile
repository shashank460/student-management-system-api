FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY src ./src
COPY .env.example ./.env.example
RUN chown -R node:node /app

ENV NODE_ENV=production
EXPOSE 5000
USER node
CMD ["node", "src/server.js"]
