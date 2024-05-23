FROM node
LABEL authors="Azraїl"

# Установите рабочий каталог
WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install
RUN mkdir uploads

COPY . .

CMD ["pnpm", "start"]
