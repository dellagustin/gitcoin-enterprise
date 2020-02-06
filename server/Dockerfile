# ---------------BUILD---------------
FROM node:13 as build-stage

# enviroment
WORKDIR /app
ENV NODE_OPTIONS=--max_old_space_size=4096
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# dependencies (only .json / .lock -> docker cache)
COPY *.json ./
COPY yarn.lock .

WORKDIR /app
COPY *.json ./
RUN yarn install --link-duplicates --ignore-optional --focus

# prepare sourcefiles
COPY ./ ./

# build
RUN yarn build

# prune dev dependencies from all projects
RUN yarn install --production --link-duplicates --ignore-optional --focus

# ---------------PROD---------------
FROM mhart/alpine-node:slim-13 as production-stage
ENV NODE_ENV production
RUN addgroup -g 1000 node && \
    adduser -u 1000 -G node -s /bin/sh -D node
EXPOSE 3000
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init



COPY --from=build-stage /app/node_modules /app/node_modules

# copy runtime code for albatross
COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/res /app/res
COPY --from=build-stage /app/*.json /app
COPY --from=build-stage /app/*.env /app

RUN umask 333
RUN chown node /app
WORKDIR /app
USER node
CMD [ "dumb-init", "node", "dist/main.js" ]
