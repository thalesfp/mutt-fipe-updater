FROM node:10-alpine

ENV NODE_ENV=production

WORKDIR /mutt-fipe-updater

COPY ./package* ./

RUN npm install

COPY . .

RUN npm run build-ts

CMD [ "npm", "start" ]
 