# Gunakan image Node.js resmi
FROM node:18-alpine

# Tentukan working directory di container
WORKDIR /app

# Copy file package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy semua file project
COPY . .

# Expose port yang digunakan server.js
EXPOSE 5000

# Jalankan server
CMD ["node", "server.js"]
