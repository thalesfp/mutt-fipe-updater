FROM node:10-alpine

ENV NODE_ENV=production

WORKDIR /mutt-fipe-updater

COPY . .

RUN npm install

RUN npm run build-ts

CMD [ "npm", "start" ]
