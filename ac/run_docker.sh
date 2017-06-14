#!/bin/bash
set -ex

# Rename existing container
#docker rename ac ac-$(date +"%F-%T") || true

# Run docker
docker run \
    -d \
    -v /var/run/lirc/lircd:/var/run/lirc/lircd \
    -e AC_LOCATION="3rd" \
    -e AWS_ACCESS_KEY_ID="" \
    -e AWS_SECRET_ACCESS_KEY="" \
    -e HOSTNAME="`hostname | xargs echo -n`" \
    -p 8833:8833 \
    --restart always \
    --name ac \
    buzzvil/ac
