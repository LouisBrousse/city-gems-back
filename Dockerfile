FROM node:21

WORKDIR /src

# Copy package.json and yarn.lock files first to leverage Docker cache
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN yarn prisma generate --schema=src/models

# Build the project
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
