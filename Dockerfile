FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install @nestjs/cli

COPY . .

RUN apk add --no-cache ttf-dejavu

CMD ["npm", "run", "start:dev"]