#!/bin/bash
set -ex

docker pull buzzvil/ac
docker run \
	-d \
	-v /master_env.sh:/master_env.sh:ro \
    -v /var/run/lirc/lircd:/var/run/lirc/lircd:ro \
    --device=/dev/i2c-1 \
	-p 8833:8833 \
	--restart always \
	--name ac \
    buzzvil/ac
