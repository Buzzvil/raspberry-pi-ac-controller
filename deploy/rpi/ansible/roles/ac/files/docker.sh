#!/bin/bash
set -ex

docker pull buzzvil/ac
docker run \
	-d \
	-e AC_LOCATION=$1 \
    -e AWS_ACCESS_KEY_ID=$2 \
	-e AWS_SECRET_ACCESS_KEY=$3 \
	-e HOSTNAME="`hostname | xargs echo -n`" \
	-p 8833:8833 \
	--restart always \
	--name ac \
    buzzvil/ac
