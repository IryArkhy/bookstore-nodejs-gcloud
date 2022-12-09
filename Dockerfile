# Use a node 16 base image
ARG NODE_VERSION=16
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src

# Copy package.json and install node modules
COPY package.json .
RUN npm install

# Add app source code
ADD . /usr/src

ENTRYPOINT npm run start