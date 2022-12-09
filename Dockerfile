# Use a node 16 base image
ARG NODE_VERSION=16
FROM node:${NODE_VERSION}-slim as base
RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /usr/src/app

# Copy package.json and install node modules
COPY package.json ./
COPY prisma ./prisma/
COPY .env ./
COPY tsconfig.json ./

COPY . .

RUN npm install

RUN npx prisma generate

FROM base as production

ENV NODE_PATH=./build

RUN npm run build