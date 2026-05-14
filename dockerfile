FROM node:18-alpine AS build

# Installiere dumb-init
RUN apk add --no-cache dumb-init

# Installiere eine kompatible Version von npm
RUN npm install -g npm@10.8.2

# Arbeitsverzeichnis erstellen
WORKDIR /app

# Kopiere nur die package.json und package-lock.json
COPY package*.json ./

# Erzwungene Neuinstallation der Abhängigkeiten
RUN npm cache clean --force && npm install --omit=dev

# Kopiere den Quellcode
COPY . .

# Exponiere Ports
EXPOSE 8888

# Start der App
CMD ["/usr/bin/dumb-init", "node", "server.js"]
