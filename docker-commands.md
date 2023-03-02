1.                                       commonly used commands with docker

what is a container- this is a running environment of an image

docker ps - check status of all running docker containers
docker pull<docker image name> -download new docker image to your machine
docker images - check all the available docker images in your machine
docker run <docker image name> - this will start the docker image in a container if available in the system but pull and run when unavailable
docker run -d <docker image name> - start docker container in a detached mode - gives you the id of the docker container  
docker start<id> - starts specific docker container
docker stop <id> - stops specific docker container
docker ps -a - shows containers that are running or not running

2.                                   Troubleshooting a container

// we can bind two containers when running on the same port as follows

docker p<your preferred port number >:<container port number> <container  image name>
//example you have two redis containers sharing port 6379

//this is how to bind them to diffrent ports

docker run -p6000:6379
docker run -p6001:6379 redis:4.0
docker logs<container id> - check problem associated with the container using the id if you remember
docker logs <container name> - same way check container logs using the name
docker rm deletes the container
docker rmi deletes an image
docker ps -a | grep <container name> - gives the id of container

// we reset image name using this docker command
docker run -d -p6000:6379 --name <new container name> <container image>
example //docker run -d -p6001:6379 --name redis-older redis:4.0

docke exec - to get the terminal of running container
//for example you have developed your own application container
//you can use the name directly or chose to work with the ids

docker exec -it 6ffcfbc358fa /bin/bash
//pwd =print which directory
docker exec -it 6ffcfbc358fa /bin/bash or similarly docker exec -it 6ffcfbc358fa /bin/sh for some containers we dont have bash but shell
root@6ffcfbc358fa:/data# ls
dump.rdb
root@6ffcfbc358fa:/data# pwd
/data
root@6ffcfbc358fa:/data# cd / = check home directory
root@6ffcfbc358fa:/# ls
bin boot data dev etc home lib lib64 media mnt opt proc root run sbin srv sys tmp usr var
root@6ffcfbc358fa:/# env = check env variables
HOSTNAME=6ffcfbc358fa
REDIS*DOWNLOAD_SHA=1e1e18420a86cfb285933123b04a82e1ebda20bfb0a289472745a087587e93a7
PWD=/
HOME=/root
REDIS_VERSION=4.0.14
GOSU_VERSION=1.12
TERM=xterm
REDIS_DOWNLOAD_URL=http://download.redis.io/releases/redis-4.0.14.tar.gz
SHLVL=1
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
*=/usr/bin/env
OLDPWD=/data
root@6ffcfbc358fa:/# exit = exit the terminal

//test own application

-we pull mongo and mongo-express to make mongo db database available for our application and also to connect mongo express with mongodb container
-in order to do the above we have docker network
-command is
// docker network ls
-we can create a network for a container using this command

--docker network create mongo-network then you do docker network ls to check if network has been created
-in order to make mongo db container run in the mongo-express container we execute the following command
--docker run -p 27027:27017

//this is the command to run mongo db with the network b4 we can make connection with mongo express

docker run -p 27017:27017 -d \
-e MONGO_INITDB_ROOT_USERNAME=admin \
-e MONGO_INITDB_ROOT_PASSWORD=password \
--name mongodb \
--net mongo-network \
mongo \

//the above command will result to the command below to avoid conflicts on repeating the already allocated port and names

//docker run -p 27017 -d \
// -e MONGO_INITDB_ROOT_USERNAME=admin \
//-e MONGO_INITDB_ROOT_PASSWORD=password \
//--name mongodb \
//--net mongo-network \
//mongo \

//the above command will give the id then you can do docker log plus the id given to get access to the logs of that mongodb container or any other container but rem diff containers have diffrent ports

//the next thing we gonna do is set up the mongo-express to run on the already running mongo db
//the code used is as below

docker run -p 8081:8081 -d \

> -e ME_CONFIG_MONGODB_ADMINUSERNAME=admin \
> -e ME_CONFIG_MONGODB_ADMINPASSWORD=password \
> --net mongo-network \
> --name mongo-express \
> -e ME_CONFIG_MONGODB_SERVER=mongodb \
> mongo-express
> //the result for the above command gives an id where you can check the logs if the connection to the mongo db database was successful or not
> //to access the database with the browser you just type localhost:8081

//we now connect to the database using node js and the way to do this is using the protocol of the database and the uri
//URI for mongodb is the localhost and the port that is accessible at

//example="mongodb://admin:password@localhost:27017"

//to get the last part of information from logs we do docker logs <container id> | tail
//

//summary of run commands is shown in the picture above
//using docker ru commands can be a bit tidious and docker compose is the alternative for this

                          DOCKER COMPOSE

--Docker compose is a structured way to contain very normal docker commands

                                creating a docker compose file

//first create yaml file inside your vs code editor as example below

version: "3"
services:
mongodb:
image: mongo
ports: - 27017:27017
environment: - MONGO_INITDB_ROOT_USERNAME=admin - MONGO_INITDB_ROOT_PASSWORD=password
mongo-express1:
image: mongo-express
ports: - 8080:8081
environment: - ME_CONFIG_MONGODB_ADMINUSERNAME=admin - ME_CONFIG_MONGODB_ADMINPASSWORD=password - ME_CONFIG_MONGODB_SERVER=mongodb1

//back to the terminal and make sure no container is running
//execute docker-compose -f mongo.yaml up
//same way you can replace the up with down to stop the containers running
//execute docker-compose -f mongo.yaml down
//we have have named our yaml file as mongo in vs for the above example

                         ----building our own docker file from an application we built----------

Docker file is a blueprint of creating docker images
syntax of docker file

FROM node -install node image
ENV MONGO_MONGO_DB_USERNAME=admin\ - set mongo db username
ENV MONGO_MONGO_DB_PASSWORD=password\ - set mongo db pwd
RUN mkdir -p/home/app -directory will be created inside the container not laptop\
COPY . /home/app - copy current folder files to /home/app
CMD ['node','server.js'] - start app with:'node server.js '

to build an image use this command => docker build -t <your app name>:<version>
we commit application to github with the docker file then jenkins will build a docker image
a tester can take the image for the app to test

                   ---push docker image to aws repository-----

pre-requisites:
1.AWS Cli needs to be installed to your machine
2.Credentials configured

step 1
create aws account if none is available and login to private repo!
step 2
visit the ECR from services options in aws to add a private respo
step 3
create a new repo in aws registry
locate to push commands in the aws registry
configure your aws login credentions in your terminal
build your private image using docker build command if unbuild
attach your AWS tag name to the image container name b4 pushing

NB:MAKE SURE TO CHANGE YOUR IMAGE VERSION CORRECTLY AS THEY ARE ALWAYS SET TO LATEST BY DEFAULT IN AWS REPOSITORIES

then you push your image to the aws repo

                                       --vim--
                                       vim mongo.yaml
                                       press esc and then full colon to save and quit editor

add the image url to the yaml compose file to have all the requirements required to make up an application
the uri from aws will show docker that the image was locally build and can be pulled from aws not docker hub

                            --docker volumes--

docker volumes help to store information everytime the application makes changes to the database so as when the container restarts it does not lose its data

3 types of volumes

-docker run
1.host volumes

Has otption -v where you define the reference btwn the host directory and the container directory
-you decide which folder on the host file system you mount into the container

                                2. anonymous volumes

where you create a volume just by referencing the container directory so you dont specify which directory on the host should be mounted
The directory is automatically created by docker under the varly docker volumes so for each container there will be a folder generated that gets mounted automatically to the container

                                3.Name volumes

its an improvement of anonymous volumes where it specifies the name of the folder on the host file system
