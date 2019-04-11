FROM node:10-alpine

ENV NODE_ENV=production

WORKDIR /mutt-fipe-updater

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "npm", "start" ]
