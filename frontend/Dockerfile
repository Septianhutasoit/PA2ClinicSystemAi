# Gunakan image Node resmi
FROM node:18-alpine

WORKDIR /app

# Copy package.json dan install library
COPY package*.json ./
RUN npm install

# Copy seluruh kode frontend
COPY . .

# Jalankan Next.js
CMD ["npm", "run", "dev"]