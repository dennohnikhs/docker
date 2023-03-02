FROM node:19-alpine
# Create app directory
ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password
# Install app dependencies
COPY . /package*.json ./

RUN npm install
RUN mkdir -p /home/app
# Copying rest of the application to app directory
COPY . /home/app
WORKDIR /home/app
# Expose the port and start the application
EXPOSE 4000
CMD ["node","server.js"]
