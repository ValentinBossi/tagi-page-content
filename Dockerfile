FROM mcr.microsoft.com/playwright:bionic

COPY package*.json ./

RUN npm install

COPY index.ts index.ts

EXPOSE 3000

USER pwuser

CMD [ "npm", "start" ]