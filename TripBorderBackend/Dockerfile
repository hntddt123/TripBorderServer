# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=24.9.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Make sure latest npm is intstalled
RUN npm install -g npm

# Install dependencies
RUN npm i

# Copy the rest of the application code
COPY . .

# Run the application.
CMD ["npm", "run", "server"]

