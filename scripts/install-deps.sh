#!/bin/bash

# Install Node.js 4
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential

# Update NPM
sudo npm install -g npm
# gulp
sudo npm install -g gulp
gulp update-db
gulp build
npm install --production

# Get the external IP
export myip="$(dig +short myip.opendns.com @resolver1.opendns.com)"

# Set production
export NODE_ENV=production