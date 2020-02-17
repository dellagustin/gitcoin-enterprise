FROM node:12

COPY ./server/node_modules /app/node_modules
COPY ./server/dist /app/dist
COPY ./server/docs /app/docs
COPY ./server/operational-data-template /app

WORKDIR /app

EXPOSE 3000
CMD [ "node", "dist/main.js" ]