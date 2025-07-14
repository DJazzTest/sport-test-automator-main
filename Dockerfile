# Playwright Dockerfile for CI and local runs
FROM mcr.microsoft.com/playwright:v1.42.1

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Optional: set env vars for CI
ENV PLAYWRIGHT_BROWSERS_PATH=0

CMD ["npx", "playwright", "test"]
