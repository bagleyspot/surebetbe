FROM node:14

# SET WORKSPACE
WORKDIR /usr/src/app

COPY package.json ./

# INSTALL APP DEPENDENCIES
RUN npm install

COPY . .

EXPOSE 8081

CMD ["node","app.js"]
