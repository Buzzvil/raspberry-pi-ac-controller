#!/bin/bash
set -ex

# Run docker
docker run \
    -d \
    -v /master_env.sh:/master_env.sh:ro \
    -v /var/run/lirc/lircd:/var/run/lirc/lircd:ro \
    --device=/dev/i2c-1 \
    -p 8833:8833 \
    --restart always \
    --log-opt max-size=10m \
    --log-opt max-file=10 \
    --name ac \
    buzzvil/ac:2018-06-05
