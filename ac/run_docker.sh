#!/bin/bash
# This will be called from docker entry point
set -ex

# Rename existing container
#docker rename ac ac-$(date +"%F-%T") || true

# Run docker
docker run \
	-d \
	-p 8833:8833 \
	--restart always \
	--name ac \
    ac
