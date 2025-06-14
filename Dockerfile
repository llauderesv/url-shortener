FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

ENV PORT 3000

# Expose the port your app runs on (change if necessary)
EXPOSE 3000

# Command to run the application (adjust as needed)
CMD ["node", "server.js"]