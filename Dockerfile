FROM node

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY index.ts index.ts

#Wenn heroku config:set GOOGLE_APPLICATION_CREDENTIALS=text2speech-cea475955cdf.json
#gemacht wurde ist das:
#--->ENV GOOGLE_APPLICATION_CREDENTIALS=text2speech-cea475955cdf.json
#nicht mehr nötig!
#ENV GOOGLE_APPLICATION_CREDENTIALS=text2speech-cea475955cdf.json

EXPOSE 3000


CMD [ "npm", "start" ]