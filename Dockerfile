# Use the latest Node version
FROM node:22-alpine

# Create a working directory
WORKDIR /usr/src/app

# Copy the configuration files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the code
COPY . .

# Build the project (Compiling TypeScript)
RUN npm run build

# Expose the port of the server
EXPOSE 3000

# Run command (wait for DB, run Migrations and start the server)
CMD npx prisma migrate deploy && node dist/src/main.js