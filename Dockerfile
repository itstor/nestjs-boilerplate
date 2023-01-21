##! ================Build stage================
FROM node:alpine as build-stage

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Bundle app source
COPY src ./src
COPY tsconfig*.json ./

# Build app
RUN pnpm build

##! ================Run stage================
FROM node:alpine as run-stage

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY public ./public
COPY views ./views

# Install dependencies
RUN pnpm install --prod --frozen-lockfile

# Bundle app source
COPY --from=build-stage /usr/src/app/dist .

# Expose port
EXPOSE 5050

# Run app
CMD [ "node", "main.js" ]
