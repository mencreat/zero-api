# Gunakan image Node.js berbasis Debian agar bisa install APT packages
FROM node:20

# Install dependensi APT untuk Puppeteer / Playwright (Chromium)
RUN apt-get update && apt-get install -y \
    ca-certificates fonts-liberation gconf-service libappindicator1 libasound2 \
    libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 \
    libgbm1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 \
    libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 \
    libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 \
    libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release \
    wget xdg-utils xvfb --no-install-recommends \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Salin package.json & package-lock.json (jika ada)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Salin seluruh kode proyek ke dalam image
COPY . .

# Tentukan port
EXPOSE 5000

# Jalankan app
CMD ["node", "index.js"]
