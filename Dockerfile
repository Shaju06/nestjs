# Use official Node LTS image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of your source code
COPY . .

# Expose app port
EXPOSE 3000

# Start the NestJS app
CMD ["npm", "run", "start:dev"]