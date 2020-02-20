FROM node:12

COPY ./server/node_modules /app/node_modules
COPY ./server/dist /app/dist
COPY ./server/docs /app/docs
COPY ./server/operational-data-template /app
COPY ./server/.env.json /app/.env.json

WORKDIR /app

EXPOSE 3001
CMD [ "node", "dist/gitcoin-enterprise-server.js" ]