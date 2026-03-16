FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN apk add --no-cache openssl && \
    openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes \
    -subj "/CN=sampler"
COPY . .
EXPOSE 3000
CMD ["node", "sampler.js"]