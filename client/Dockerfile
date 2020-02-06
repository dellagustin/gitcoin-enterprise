# build stage
FROM node:lts-alpine as build-stage

WORKDIR /app
COPY package*.json ./
COPY tsconfig.settings.json ./
COPY yarn.lock ./
RUN apk update && apk upgrade && apk add --no-cache bash git openssh
COPY ./ ./

RUN yarn install

RUN yarn run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
