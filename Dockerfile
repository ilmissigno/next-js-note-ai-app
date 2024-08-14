FROM node:18

WORKDIR /app
COPY ./package*.json ./
RUN npm install
RUN npm i --force
COPY ./ .
EXPOSE 3000
CMD npm run dev