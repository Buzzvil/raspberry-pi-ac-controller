#!/bin/bash
set -ex

# Rename existing container
#docker rename ac ac-$(date +"%F-%T") || true

# Run docker
#	-v /var/run/lirc/lircd:/var/run/lirc/lircd \
docker run \
	-d \
	-p 8833:8833 \
	--restart always \
	--name ac \
    buzzvil/ac
