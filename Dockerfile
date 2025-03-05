FROM node:18-slim

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Heroku will provide its own PORT
# Remove the hardcoded ENV PORT line to use Heroku's PORT
# EXPOSE is just documentation, not needed for Heroku

EXPOSE 3000

# Start the application
CMD ["npm", "start"] 