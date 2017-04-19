#! /bin/bash

mkdir -p web/dist
nodemon -w web/client -w web/client/styles -x "bash build.sh" & 
nodemon -w web/dist -w web/server/ web/server/server.js
