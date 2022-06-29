#This is the base image we are inheriting from 
FROM node

#Tells the container to start in that directory
WORKDIR /app

#Copying the package.json file first so that there isn't a conflict with the node-modules directory
COPY package.json ./

RUN npm install

COPY . ./

#This is the last command we need to start the container/server
CMD npm start

