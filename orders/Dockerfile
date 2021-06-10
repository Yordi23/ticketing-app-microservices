FROM node:alpine

WORKDIR /app
COPY package.json .
COPY tsconfig.json .
RUN npm install --only=prod
COPY . .

CMD ["npm","start"]