#!/bin/bash
set -ex

docker build . -t buzzvil/ac:latest
cat ~/.docker/config.json | grep index.docker.io || docker login
docker push buzzvil/ac:latest
