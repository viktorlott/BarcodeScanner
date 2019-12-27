#!/bin/bash

# git pull

yarn run build

pm2 delete scanner

pm2 start ./server/index.js --name scanner

echo -e "Done!"