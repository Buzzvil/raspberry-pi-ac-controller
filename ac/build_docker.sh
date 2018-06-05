#!/bin/bash
set -ex

docker build -t buzzvil/ac:2018-06-05 .
cat ~/.docker/config.json | grep index.docker.io || docker login
docker push buzzvil/ac:2018-06-05
